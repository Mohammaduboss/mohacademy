const { GoogleGenerativeAI } = require('@google/generative-ai');

async function evaluateLab(studentData, labBlueprint) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY is missing from .env file.");

        console.log(`[AI System] Initiating grading sequence for ${labBlueprint.subject} (${labBlueprint.experimentCode})...`);

        // 1. DYNAMICALLY FETCH AVAILABLE MODELS TO PREVENT 404 ERRORS
        const modelRequest = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const modelData = await modelRequest.json();

        if (!modelData.models) {
            console.error("API Key rejection details:", modelData);
            throw new Error("Failed to fetch model list. Verify your API Key.");
        }

        // 2. FIND THE FIRST GEMINI MODEL SUPPORTING CONTENT GENERATION
        const activeModelInfo = modelData.models.find(m => 
            m.name.includes("gemini") && 
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes("generateContent")
        );

        if (!activeModelInfo) {
            throw new Error("No active Gemini text models found on this Google account.");
        }

        const activeModelName = activeModelInfo.name.replace('models/', '');
        console.log(`[AI System] Auto-selected authorized model: ${activeModelName}`);

        // 3. INITIALIZE GEMINI (STRICT JSON MIME TYPE)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: activeModelName,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        // 4. THE MASTER PROMPT ROUTER
        let prompt = "";
        const isStation = labBlueprint.experimentType === "station" || studentData.isStation;

        if (isStation) {
            // ==========================================
            // PHYSICS STATIONS (GRADED ON 10 MARKS)
            // ==========================================
            prompt = `
                You are a strict but encouraging GCE A-Level Physics Chief Examiner.
                You are grading a "Station" virtual practical experiment.

                EXPERIMENT DETAILS:
                Title: ${labBlueprint.title}
                Rubric & Expected Outcomes: ${JSON.stringify(labBlueprint.gradingRubric)}

                STUDENT SUBMISSION (STATION):
                Procedure: ${studentData.procedure || "Blank"}
                Observations / Measurements: ${studentData.observations || "Blank"}
                Calculations: ${studentData.calculations || "Blank"}
                Precautions & Conclusion: ${studentData.precautions || "Blank"}

                YOUR TASK:
                1. Evaluate the written procedure for correctness and logical flow based on the apparatus.
                2. Check if their observations/measurements are physically sound and realistic.
                3. Evaluate their calculations and final conclusions against the rubric logic.
                4. Check for relevant stated precautions.
                5. Grade them strictly out of 10 points. If fields are blank, score zero for those sections.

                IMPORTANT: Return exactly this JSON structure:
                {
                    "score": <number between 0 and 10>,
                    "feedback": "<string containing HTML formatted <p> and <ul> tags explaining the grade>"
                }
            `;
        } else if (labBlueprint.subject === "Biology") {
            // ==========================================
            // BIOLOGY MAINSTREAM (GRADED ON 40 MARKS)
            // ==========================================
            prompt = `
                You are a strict but encouraging GCE A-Level Biology Chief Examiner.
                You are grading a Biology virtual practical experiment.

                EXPERIMENT DETAILS:
                Title: ${labBlueprint.title}
                Specific AI Grading Rubric: ${labBlueprint.aiGradingRubric || "Evaluate biological accuracy based on standard A-Level principles."}

                STUDENT SUBMISSION:
                Student's Logged Observations & Deductions: ${JSON.stringify(studentData.studentObservations || studentData)}
                Final State of Virtual Apparatus (If applicable): ${JSON.stringify(studentData.experimentState || "N/A")}

                YOUR TASK:
                1. Scrutinize the student's typed observations and deductions against the specific AI Grading Rubric provided above.
                2. Evaluate if they correctly identified color changes, physiological reactions, and biological inferences.
                3. If they left observations blank or wrote vague descriptions (e.g., "it changed"), penalize them heavily.
                4. Grade them strictly out of 40 points.

                IMPORTANT: Return exactly this JSON structure:
                {
                    "score": <number between 0 and 40>,
                    "feedback": "<string containing HTML formatted <p> and <ul> tags explaining the grade>"
                }
            `;
        } else if (labBlueprint.subject === "Chemistry") {
            // ==========================================
            // CHEMISTRY MAINSTREAM (GRADED ON 40 MARKS)
            // ==========================================
            prompt = `
                You are a strict but encouraging GCE A-Level Chemistry Chief Examiner.
                You are grading a Chemistry virtual practical experiment.

                EXPERIMENT DETAILS:
                Title: ${labBlueprint.title}
                Rubric & Expected Outcomes: ${JSON.stringify(labBlueprint.gradingRubric)}

                STUDENT SUBMISSION:
                Data Table Readings (Titrations, Thermochemistry, etc.): ${JSON.stringify(studentData.tableData || "Blank")}
                Student's Calculations & Answers: ${JSON.stringify(studentData.calculations || "Blank")}

                YOUR TASK:
                1. Check their table data. (e.g., Rough titre should normally be slightly higher than accurate titres).
                2. Check if their calculated values (titres, temperature changes, 1/t rates) are mathematically correct based on their raw data.
                3. Evaluate their stoichiometric calculations and chemical equations for accuracy based on the rubric.
                4. Grade them strictly out of 40 points. Penalize for missing units, blank fields, or unbalanced equations.

                IMPORTANT: Return exactly this JSON structure:
                {
                    "score": <number between 0 and 40>,
                    "feedback": "<string containing HTML formatted <p> and <ul> tags explaining the grade>"
                }
            `;
        } else {
            // ==========================================
            // PHYSICS MAINSTREAM (GRADED ON 40 MARKS)
            // ==========================================
            prompt = `
                You are a strict but encouraging GCE A-Level Physics Chief Examiner.
                You are grading a "Mainstream" virtual physics practical experiment.

                EXPERIMENT DETAILS:
                Title: ${labBlueprint.title}
                Rubric & Expected Outcomes: ${JSON.stringify(labBlueprint.gradingRubric)}

                STUDENT SUBMISSION:
                Raw Data Table: ${JSON.stringify(studentData.tableData || "Blank")}
                Slope Calculation Formula: ${studentData.slopeFormula || "Blank"}
                Final Calculated Slope: ${studentData.slope || "Blank"}
                Precaution Stated: ${studentData.precautions || "Blank"}
                Inferences/Deductions: ${studentData.inferences || "Blank"}

                YOUR TASK:
                1. Check if their table data has enough rows and if the numbers make mathematical sense based on the rubric. If the table is empty, penalize heavily.
                2. Check if their calculated slope matches the expected slope (allow a small margin of error for human drawing).
                3. Evaluate their stated precaution and inferences for scientific accuracy.
                4. Grade them strictly out of 40 points.

                IMPORTANT: Return exactly this JSON structure:
                {
                    "score": <number between 0 and 40>,
                    "feedback": "<string containing HTML formatted <p> and <ul> tags explaining the grade>"
                }
            `;
        }

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        // 5. CRITICAL FIX: THE FLATTENER
        // Clean up markdown block syntax if the AI mistakenly adds it
        responseText = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        
        // This converts any rogue physical line breaks, carriage returns, or tabs into blank spaces.
        // This guarantees JSON.parse will never crash due to a "bad control character".
        responseText = responseText.replace(/[\n\r\t]/g, ' ');
        
        return JSON.parse(responseText);

    } catch (error) {
        console.error("Gemini Evaluation Error:", error);
        throw new Error("Failed to process AI Evaluation.");
    }
}

module.exports = { evaluateLab };