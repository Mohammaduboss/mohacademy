/* ==========================================================================
   MOHACADEMY VIRTUAL LAB ENGINE - BIOLOGY
   ========================================================================== */

let currentExperiment = null;
let experimentState = {}; // Stores user inputs, chemical states, slider values, etc.

// Lab 14 Specific State
let tubeStates = {
    starch: { reagentAdded: false, heated: false, color: '#e2e8f0', statusText: '2ml Solution Q' },
    reducing: { reagentAdded: false, heated: false, color: '#e2e8f0', statusText: '2ml Solution Q' },
    nonreducing: { hclAdded: false, neutralized: false, benedictAdded: false, heated: false, color: '#e2e8f0', statusText: '2ml Solution Q' },
    lipids: { ethanolAdded: false, waterAdded: false, color: '#e2e8f0', statusText: '2ml Solution Q' },
    proteins: { biuretAdded: false, color: '#e2e8f0', statusText: '2ml Solution Q' }
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get Experiment ID from URL query parameters (e.g. ?id=BIO14_1)
    const urlParams = new URLSearchParams(window.location.search);
    const labId = urlParams.get('id');

    if (!labId) {
        document.getElementById('dynamic-instructions-container').innerHTML = 
            `<p style="color:#ef4444; padding:20px;">Error: No experiment ID specified in URL.</p>`;
        return;
    }

    // 2. Fetch Lab Data from Backend API
    try {
        const response = await fetch(`http://localhost:5000/api/labs/catalog`);
        if (!response.ok) throw new Error('Failed to fetch catalog');
        
        const catalog = await response.json();
        currentExperiment = catalog.find(lab => lab.experimentCode === labId);

        if (!currentExperiment) {
            document.getElementById('dynamic-instructions-container').innerHTML = 
                `<p style="color:#ef4444; padding:20px;">Error: Experiment "${labId}" not found in database.</p>`;
            return;
        }

        // 3. Render Manual Instructions & Info
        renderProcedureManual(currentExperiment);

        // 4. Route to specific experiment interactive simulation
        loadSimulationEngine(currentExperiment.experimentCode);

    } catch (error) {
        console.error("Engine Initialization Error:", error);
        document.getElementById('dynamic-instructions-container').innerHTML = 
            `<p style="color:#ef4444; padding:20px;">Server Error: Ensure backend node is running on port 5000.</p>`;
    }
});

/**
 * Renders the left-hand procedure panel with instructions and safety steps
 */
function renderProcedureManual(lab) {
    const container = document.getElementById('dynamic-instructions-container');
    
    // Check if we are passing a pre-formatted HTML string (manualContent) from seed.js
    if (lab.manualContent) {
        container.innerHTML = `
            <div style="padding: 15px; color: #cbd5e1;">
                <div style="font-size: 0.85rem; margin-bottom: 15px; color: #94a3b8;">
                    <span><i class="fas fa-tag"></i> ${lab.category}</span> | 
                    <span style="color:#fbbf24;"><i class="fas fa-star"></i> ${lab.xpReward} XP</span>
                </div>
                ${lab.manualContent}
            </div>
        `;
        return;
    }

    let instructionsList = '';
    if (lab.instructions && Array.isArray(lab.instructions)) {
        instructionsList = lab.instructions.map(step => `<li>${step}</li>`).join('');
    } else {
        instructionsList = `<li>Follow standard biological protocol as outlined in your manual.</li>`;
    }

    container.innerHTML = `
        <div style="padding: 15px; color: #cbd5e1;">
            <h2 style="color: #10b981; font-family: 'Poppins'; font-size: 1.2rem; margin-top:0;">
                ${lab.title}
            </h2>
            <div style="font-size: 0.85rem; margin-bottom: 15px; color: #94a3b8;">
                <span><i class="fas fa-tag"></i> ${lab.category}</span> | 
                <span style="color:#fbbf24;"><i class="fas fa-star"></i> ${lab.xpReward} XP</span>
            </div>
            
            <h4 style="color: #fff; font-family: 'Poppins'; margin-bottom: 8px;">Experimental Objectives</h4>
            <p style="font-size: 0.9rem; line-height: 1.5; color: #cbd5e1;">${lab.description || 'Observe and analyze biological phenomena.'}</p>
            
            <h4 style="color: #fff; font-family: 'Poppins'; margin-bottom: 8px; margin-top: 20px;">Procedure & Steps</h4>
            <ol style="padding-left: 20px; font-size: 0.88rem; line-height: 1.7; color: #cbd5e1;">
                ${instructionsList}
            </ol>
        </div>
    `;
}

/**
 * Main Router that loads specific simulation logic based on Experiment Code
 */
function loadSimulationEngine(code) {
    const workspace = document.getElementById('simulation-render-target');
    const tableContainer = document.getElementById('dynamic-data-table-container');

    workspace.innerHTML = ''; // Clear canvas
    tableContainer.innerHTML = ''; // Clear data table

    switch (code) {
        case 'BIO14_1': 
            initLab14Engine(workspace, tableContainer); 
            break;
        case 'BIO14_2': 
            initLab14_2Engine(workspace, tableContainer); 
            break;    
        case 'BIO14_3': 
            initLab14_3Engine(workspace, tableContainer); 
            break; 
        case 'BIO15_1': 
            initLab15_1Engine(workspace, tableContainer); 
            break; 
        case 'BIO15_2': 
            initLab15_2Engine(workspace, tableContainer); 
            break;   
        case 'BIO15_3': 
            initLab15_3Engine(workspace, tableContainer); 
            break;      
        case 'BIO15_4': 
            initLab15_4Engine(workspace, tableContainer); 
            break;
        case 'BIO15_5': 
            initLab15_5Engine(workspace, tableContainer); 
            break; 
        case 'BIO15_6': 
            initLab15_6Engine(workspace, tableContainer); 
            break;    
        case 'BIO13_1': 
            initLab13_1Engine(workspace, tableContainer); 
            break;       
        case 'BIO13_2': 
            initLab13_2Engine(workspace, tableContainer); 
            break;    
        case 'BIO13_3': 
            initLab13_3Engine(workspace, tableContainer); 
            break; 
        case 'BIO16_1': 
            initLab16_1Engine(workspace, tableContainer); 
            break;
        case 'BIO17_1': 
            initLab17_1Engine(workspace, tableContainer); 
            break;       
        // Future experiments will go here
        // case 'BIO15_1': initEnzymeSim(workspace, tableContainer); break;

        default:
            workspace.innerHTML = `
                <div style="text-align: center; color: #94a3b8; padding: 60px 20px;">
                    <i class="fas fa-flask fa-3x" style="color: #10b981; margin-bottom: 15px;"></i>
                    <h3 style="color: #fff;">Awaiting Simulation Logic</h3>
                    <p>Engine code for <strong>${code}</strong> is currently being loaded.</p>
                </div>
            `;
            break;
    }
}

/**
 * Tab Switching Helper (Data Table / Graphs / Calculations)
 */
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.add('active');

    const activeBtn = event.currentTarget;
    if (activeBtn) activeBtn.classList.add('active');
}

/**
 * Sends student experimental results to Chief Examiner AI for grading
 */
async function submitLabForGrading() {
    const modal = document.getElementById('ai-modal');
    const feedbackBox = document.getElementById('ai-feedback-content');
    
    if (!currentExperiment) {
        alert("Experiment data is missing. Please refresh the page.");
        return;
    }

    // 1. Show Loading State
    modal.style.display = 'flex';
    feedbackBox.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <i class="fas fa-circle-notch fa-spin fa-2x" style="color: #10b981; margin-bottom: 10px;"></i>
            <p>Chief Examiner AI is evaluating your observations and deductions against the GCE marking scheme...</p>
        </div>
    `;

    // 2. Collect all student inputs from the dynamic data table
    const inputs = document.querySelectorAll('.sim-input');
    let studentData = {};
    inputs.forEach((input, index) => {
        studentData[`field_${index + 1}`] = input.value;
    });

    // 3. Send to your REAL backend route that uses geminiEvaluator
    try {
        const token = localStorage.getItem('mohacademy_token');
        const response = await fetch(`http://localhost:5000/api/labs/${currentExperiment.experimentCode}/submit`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token
            },
            body: JSON.stringify({
                studentObservations: studentData,
                experimentState: singleTubeState // Passes the visual state of the lab
            })
        });

        const data = await response.json();
        
        // 4. Render the AI's response
        if (response.ok) {
            feedbackBox.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
                    <strong style="color: #10b981; font-size: 1.1rem;">Score: ${data.score || 'Graded'}</strong>
                </div>
                <div style="white-space: pre-line; line-height: 1.6; color: #cbd5e1;">
                    ${data.feedback || data.message}
                </div>
            `;
        } else {
            feedbackBox.innerHTML = `<p style="color:#ef4444;">Evaluation Error: ${data.message || 'Unable to process grading.'}</p>`;
        }
    } catch (err) {
        console.error("AI Evaluation Failed:", err);
        feedbackBox.innerHTML = `
            <div style="text-align: center; color: #ef4444; padding: 20px;">
                <i class="fas fa-exclamation-triangle fa-2x" style="margin-bottom: 10px;"></i>
                <p>Network Error: Could not connect to the AI grading server.</p>
                <p style="font-size: 0.85rem; color: #94a3b8;">Ensure your Node.js backend is running on port 5000.</p>
            </div>
        `;
    }
}

/* ==========================================================================
   LAB 14 SPECIFIC ENGINE LOGIC: MACROMOLECULES & NUTRITION (SINGLE TUBE UI)
   ========================================================================== */

let activeTest = null;
let singleTubeState = {
    content: 'Solution Q',
    color: '#fef3c7', // Pale yellow-white soya milk
    volume: 30, // Percentage
    heated: false,
    step: 0
};

function initLab14Engine(workspace, tableContainer) {
    renderLab14Canvas(workspace);
    renderLab14Table(tableContainer);
    showIntroPopup();
}

function showIntroPopup() {
    // Create and inject the Initial Assumptions Popup
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #10b981; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(16, 185, 129, 0.2); color: #fff;">
                <h2 style="color: #10b981; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-clipboard-list"></i> Laboratory Briefing</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>Initial State & Assumptions:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>You have been provided with 50ml of <strong>Solution Q (Soya Bean Milk)</strong>. Its initial appearance is a pale yellowish-white colloidal suspension.</li>
                        <li>All virtual test tubes are pre-washed with distilled water.</li>
                        <li>The water bath is pre-heated and maintained at <strong>100°C (Boiling)</strong>.</li>
                        <li>All reagents (Benedict's, Iodine, Biuret, etc.) are freshly prepared to standard GCE concentrations.</li>
                    </ul>
                    <p style="margin-top: 15px; color: #94a3b8; font-style: italic;">Select a test from the control panel to begin. The system will automatically dispense 2cm³ of Solution Q into a clean test tube for you.</p>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #10b981; color: #fff; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; text-align: center; letter-spacing: 0.5px;">Acknowledge & Begin</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab14Canvas(workspace) {
    workspace.innerHTML = `
        <style>
            .lab-stage {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                gap: 20px;
                background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
                border-radius: 16px;
                padding: 25px;
                box-shadow: inset 0 -15px 30px rgba(0,0,0,0.6);
            }
            .test-selector-panel {
                flex: 1;
                min-width: 200px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .test-btn {
                background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Poppins'; font-weight: 600; text-align: left; transition: all 0.2s;
            }
            .test-btn:hover { background: #334155; color: #fff; }
            .test-btn.active { background: #10b981; color: #fff; border-color: #10b981; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
            
            .tube-display-panel {
                flex: 1;
                min-width: 200px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .master-tube {
                width: 60px; height: 240px; border: 3px solid rgba(255, 255, 255, 0.4); border-top: none; border-radius: 0 0 30px 30px; position: relative; background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.0) 50%, rgba(255,255,255,0.1) 100%); box-shadow: inset -5px -5px 15px rgba(0,0,0,0.5), inset 5px 0 10px rgba(255,255,255,0.1); overflow: hidden;
            }
            .fluid {
                position: absolute; bottom: 0; width: 100%; transition: background-color 1s ease, height 0.8s ease; border-radius: 0 0 27px 27px; box-shadow: inset 0 10px 15px rgba(255,255,255,0.3);
            }
            .boiling { animation: boil 0.8s infinite alternate; }
            @keyframes boil { 0% { transform: scaleY(1); box-shadow: inset 0 10px 15px rgba(255,255,255,0.4), 0 0 20px rgba(239, 68, 68, 0.5); } 100% { transform: scaleY(1.03); box-shadow: inset 0 10px 15px rgba(255,255,255,0.7), 0 0 35px rgba(239, 68, 68, 0.8); } }
            
            .reagent-shelf {
                flex: 1;
                min-width: 200px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                background: rgba(0,0,0,0.2);
                padding: 15px;
                border-radius: 12px;
                border: 1px dashed #334155;
            }
            .action-btn { background: #38bdf8; color: #0f172a; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; }
            .action-btn:hover { background: #0284c7; color: #fff; }
            .action-btn.heat { background: #ef4444; color: #fff; }
            .action-btn.heat:hover { background: #b91c1c; }
        </style>

        <div class="lab-stage">
            <div class="test-selector-panel">
                <span style="color: #10b981; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">1. Select Target Molecule</span>
                <button class="test-btn ${activeTest === 'starch' ? 'active' : ''}" onclick="selectTest('starch')">Test for Starch</button>
                <button class="test-btn ${activeTest === 'reducing' ? 'active' : ''}" onclick="selectTest('reducing')">Test for Reducing Sugars</button>
                <button class="test-btn ${activeTest === 'nonreducing' ? 'active' : ''}" onclick="selectTest('nonreducing')">Test for Non-Reducing Sugars</button>
                <button class="test-btn ${activeTest === 'lipids' ? 'active' : ''}" onclick="selectTest('lipids')">Test for Lipids</button>
                <button class="test-btn ${activeTest === 'proteins' ? 'active' : ''}" onclick="selectTest('proteins')">Test for Proteins</button>
            </div>

            <div class="tube-display-panel">
                <span style="color: #cbd5e1; margin-bottom: 10px; font-family: 'Poppins'; font-size: 0.9rem;">${activeTest ? 'Active: ' + activeTest.toUpperCase() : 'Awaiting Selection'}</span>
                <div class="master-tube ${singleTubeState.heated ? 'boiling' : ''}">
                    <div class="fluid" style="height: ${singleTubeState.volume}%; background-color: ${singleTubeState.color};"></div>
                </div>
                <span style="color: #94a3b8; margin-top: 15px; font-size: 0.8rem; text-align: center;">${singleTubeState.content}</span>
            </div>

            <div class="reagent-shelf" id="reagent-shelf">
                <span style="color: #38bdf8; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">2. Available Reagents</span>
                ${getReagentButtons()}
            </div>
        </div>
    `;
}

function getReagentButtons() {
    if (!activeTest) return `<p style="color: #64748b; font-size: 0.85rem;">Select a test first to view permitted reagents.</p>`;
    
    let btns = '';
    if (activeTest === 'starch') {
        btns += `<button class="action-btn" onclick="applyReagent('iodine')"><i class="fas fa-eye-dropper"></i> Add Iodine (I₂/KI)</button>`;
    } else if (activeTest === 'reducing') {
        btns += `<button class="action-btn" onclick="applyReagent('benedict')"><i class="fas fa-vial"></i> Add Benedict's</button>
                 <button class="action-btn heat" onclick="applyReagent('heat')"><i class="fas fa-fire"></i> Heat in Water Bath</button>`;
    } else if (activeTest === 'nonreducing') {
        btns += `<button class="action-btn" onclick="applyReagent('hcl')"><i class="fas fa-flask"></i> Boil with dil. HCl</button>
                 <button class="action-btn" onclick="applyReagent('nahco3')"><i class="fas fa-cubes"></i> Neutralize (NaHCO₃)</button>
                 <button class="action-btn" onclick="applyReagent('benedict')"><i class="fas fa-vial"></i> Add Benedict's</button>
                 <button class="action-btn heat" onclick="applyReagent('heat')"><i class="fas fa-fire"></i> Heat in Water Bath</button>`;
    } else if (activeTest === 'lipids') {
        btns += `<button class="action-btn" onclick="applyReagent('ethanol')"><i class="fas fa-vial"></i> Add Ethanol & Shake</button>
                 <button class="action-btn" onclick="applyReagent('water')"><i class="fas fa-tint"></i> Decant into Water</button>`;
    } else if (activeTest === 'proteins') {
        btns += `<button class="action-btn" onclick="applyReagent('biuret')"><i class="fas fa-eye-dropper"></i> Add Biuret Reagent</button>`;
    }
    return btns;
}

function selectTest(testName) {
    activeTest = testName;
    // Reset tube to initial 2ml of Solution Q
    singleTubeState = { content: '2cm³ Solution Q', color: '#fef3c7', volume: 30, heated: false, step: 0 };
    renderLab14Canvas(document.getElementById('simulation-render-target'));
}

function applyReagent(reagent) {
    if (reagent === 'iodine') {
        singleTubeState.volume = 40;
        singleTubeState.color = '#b45309'; // Iodine yellow/brown (Soya has no starch)
        singleTubeState.content = 'Solution Q + Iodine (Yellow/Brown)';
    } 
    else if (reagent === 'benedict') {
        singleTubeState.volume += 20;
        singleTubeState.color = '#3b82f6'; // Benedict's Blue
        singleTubeState.content += ' + Benedict\'s (Blue)';
    } 
    else if (reagent === 'biuret') {
        singleTubeState.volume = 50;
        singleTubeState.color = '#8b5cf6'; // Soya is high protein -> Purple
        singleTubeState.content = 'Solution Q + Biuret (Violet/Purple)';
    } 
    else if (reagent === 'ethanol') {
        singleTubeState.volume = 50;
        singleTubeState.color = '#fdfee8'; 
        singleTubeState.content = 'Solution Q + Ethanol';
        singleTubeState.step = 1;
    }
    else if (reagent === 'water' && singleTubeState.step === 1) {
        singleTubeState.volume = 70;
        singleTubeState.color = '#f8fafc'; // Emulsion
        singleTubeState.content = 'Cloudy White Emulsion';
    }
    else if (reagent === 'hcl') {
        singleTubeState.volume += 10;
        singleTubeState.heated = true;
        setTimeout(() => { 
            singleTubeState.heated = false; 
            singleTubeState.content = 'Hydrolyzed Solution';
            renderLab14Canvas(document.getElementById('simulation-render-target'));
        }, 1500);
    }
    else if (reagent === 'nahco3') {
        singleTubeState.content = 'Neutralized Solution';
    }
    else if (reagent === 'heat') {
        singleTubeState.heated = true;
        setTimeout(() => {
            singleTubeState.heated = false;
            // Outcome logic
            if (activeTest === 'reducing') {
                singleTubeState.color = '#3b82f6'; // Stays blue (no free red. sugar)
                singleTubeState.content = 'Heated: Remains Blue';
            } else if (activeTest === 'nonreducing') {
                singleTubeState.color = '#dc2626'; // Brick red (hydrolyzed sucrose)
                singleTubeState.content = 'Heated: Brick-Red Precipitate';
            }
            renderLab14Canvas(document.getElementById('simulation-render-target'));
        }, 2500);
    }
    renderLab14Canvas(document.getElementById('simulation-render-target'));
}

function renderLab14Table(tableContainer) {
    // Exact same table as before, keeping the inputs for the student to write their report.
    tableContainer.innerHTML = `
        <div class="table-responsive-wrapper">
            <table class="sim-table">
                <thead>
                    <tr>
                        <th>Test Target</th>
                        <th>Procedure Applied</th>
                        <th>Observation (Color / State Change)</th>
                        <th>Deduction (Inference)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>a. Starch</strong></td>
                        <td><input type="text" class="sim-input" id="rep_proc_starch" placeholder="What did you add?"></td>
                        <td><input type="text" class="sim-input" id="rep_obs_starch" placeholder="What color did you see?"></td>
                        <td><input type="text" class="sim-input" id="rep_ded_starch" placeholder="Is starch present/absent?"></td>
                    </tr>
                    <tr>
                        <td><strong>b. Red. Sugars</strong></td>
                        <td><input type="text" class="sim-input" id="rep_proc_red" placeholder="Reagent + heating?"></td>
                        <td><input type="text" class="sim-input" id="rep_obs_red" placeholder="What color after heating?"></td>
                        <td><input type="text" class="sim-input" id="rep_ded_red" placeholder="Present or absent?"></td>
                    </tr>
                    <tr>
                        <td><strong>c. Non-Red. Sugars</strong></td>
                        <td><input type="text" class="sim-input" id="rep_proc_nonred" placeholder="Hydrolysis steps?"></td>
                        <td><input type="text" class="sim-input" id="rep_obs_nonred" placeholder="Color after 2nd heating?"></td>
                        <td><input type="text" class="sim-input" id="rep_ded_nonred" placeholder="Present or absent?"></td>
                    </tr>
                    <tr>
                        <td><strong>d. Lipids</strong></td>
                        <td><input type="text" class="sim-input" id="rep_proc_lip" placeholder="Reagents used?"></td>
                        <td><input type="text" class="sim-input" id="rep_obs_lip" placeholder="Did an emulsion form?"></td>
                        <td><input type="text" class="sim-input" id="rep_ded_lip" placeholder="Present or absent?"></td>
                    </tr>
                    <tr>
                        <td><strong>e. Proteins</strong></td>
                        <td><input type="text" class="sim-input" id="rep_proc_prot" placeholder="Reagents used?"></td>
                        <td><input type="text" class="sim-input" id="rep_obs_prot" placeholder="Final color?"></td>
                        <td><input type="text" class="sim-input" id="rep_ded_prot" placeholder="Present or absent?"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

/* ==========================================================================
   LAB 14.2: DIGESTION OF STARCH BY AMYLASE (INCUBATOR ENGINE)
   ========================================================================== */

let amylaseState = {
    phase: 'setup', // 'setup', 'incubating', 'ready'
    timer: 10,
    tubes: {
        A: { starch: 0, water: 0, amylase: 0, color: 'transparent', status: 'Empty' },
        B: { starch: 0, water: 0, amylase: 0, color: 'transparent', status: 'Empty' },
        C: { starch: 0, water: 0, amylase: 0, color: 'transparent', status: 'Empty' }
    },
    activeTest: null
};

function initLab14_2Engine(workspace, tableContainer) {
    amylaseState = {
        phase: 'setup', timer: 10,
        tubes: {
            A: { starch: 0, water: 0, amylase: 0, color: 'transparent', status: 'Empty' },
            B: { starch: 0, water: 0, amylase: 0, color: 'transparent', status: 'Empty' },
            C: { starch: 0, water: 0, amylase: 0, color: 'transparent', status: 'Empty' }
        },
        activeTest: null
    };
    renderLab14_2Canvas(workspace);
    renderLab14_2Table(tableContainer);
    showLab14_2Intro();
}

function showLab14_2Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #10b981; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(16, 185, 129, 0.2); color: #fff;">
                <h2 style="color: #10b981; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-temperature-high"></i> Enzymatic Digestion Simulator</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>You must manually configure the volumes for Tubes A, B, and C according to your lab manual table.</li>
                        <li>Enzymes are highly sensitive. You must incubate the tubes at <strong>37°C (Body Temperature)</strong> for the reaction to occur.</li>
                        <li>After incubation, the system will save the state of the tubes. You can perform the Iodine, Benedict's, and Millon's tests independently.</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #10b981; color: #fff; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Initialize Apparatus</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab14_2Canvas(workspace) {
    const totalA = amylaseState.tubes.A.starch + amylaseState.tubes.A.water + amylaseState.tubes.A.amylase;
    const totalB = amylaseState.tubes.B.starch + amylaseState.tubes.B.water + amylaseState.tubes.B.amylase;
    const totalC = amylaseState.tubes.C.starch + amylaseState.tubes.C.water + amylaseState.tubes.C.amylase;

    let controlsHtml = '';
    
    if (amylaseState.phase === 'setup') {
        controlsHtml = `
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; border: 1px dashed #334155;">
                    <span style="color: #38bdf8; font-size: 0.8rem; display:block; text-align:center; margin-bottom:5px;">Tube A Config</span>
                    <button class="action-btn" style="padding: 6px 10px; font-size: 0.8rem;" onclick="addLiquid('A', 'starch')">+2ml Starch</button>
                    <button class="action-btn" style="padding: 6px 10px; font-size: 0.8rem; margin-top:5px;" onclick="addLiquid('A', 'water')">+3ml Water</button>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; border: 1px dashed #334155;">
                    <span style="color: #38bdf8; font-size: 0.8rem; display:block; text-align:center; margin-bottom:5px;">Tube B Config</span>
                    <button class="action-btn" style="padding: 6px 10px; font-size: 0.8rem;" onclick="addLiquid('B', 'water')">+2ml Water</button>
                    <button class="action-btn" style="padding: 6px 10px; font-size: 0.8rem; margin-top:5px;" onclick="addLiquid('B', 'amylase')">+3ml Amylase</button>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; border: 1px dashed #334155;">
                    <span style="color: #38bdf8; font-size: 0.8rem; display:block; text-align:center; margin-bottom:5px;">Tube C Config</span>
                    <button class="action-btn" style="padding: 6px 10px; font-size: 0.8rem;" onclick="addLiquid('C', 'starch')">+2ml Starch</button>
                    <button class="action-btn" style="padding: 6px 10px; font-size: 0.8rem; margin-top:5px;" onclick="addLiquid('C', 'amylase')">+3ml Amylase</button>
                </div>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <button class="action-btn heat" style="margin: 0 auto; display: inline-flex;" onclick="startIncubation()" ${totalA===5 && totalB===5 && totalC===5 ? '' : 'disabled opacity="0.5"'}>
                    <i class="fas fa-thermometer-half"></i> Incubate at 37°C (10 mins)
                </button>
                <span style="color:#94a3b8; font-size:0.75rem; display:block; margin-top:5px;">All tubes must total 5ml to begin incubation.</span>
            </div>
        `;
    } else if (amylaseState.phase === 'incubating') {
        controlsHtml = `
            <div style="text-align: center; color: #f59e0b;">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <h3 style="font-family: 'Orbitron', sans-serif; letter-spacing: 2px;">INCUBATING at 37°C</h3>
                <p style="font-size: 1.2rem; font-weight: bold;">T - ${amylaseState.timer} Seconds (Simulated)</p>
            </div>
        `;
    } else if (amylaseState.phase === 'ready') {
        controlsHtml = `
            <div style="text-align: center; margin-bottom: 15px;">
                <span style="color: #10b981; font-weight: bold;"><i class="fas fa-check-circle"></i> Incubation Complete. Select a qualitative test:</span>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button class="action-btn" onclick="runAmylaseTest('iodine')"><i class="fas fa-eye-dropper"></i> Iodine Test (Starch)</button>
                <button class="action-btn" onclick="runAmylaseTest('benedict')"><i class="fas fa-vial"></i> Benedict's Test (Red. Sugar)</button>
                <button class="action-btn" onclick="runAmylaseTest('millon')"><i class="fas fa-flask"></i> Millon's Test (Proteins)</button>
                <button class="action-btn" style="background:#475569; color:#fff;" onclick="restorePostIncubation()"><i class="fas fa-undo"></i> Wash & Restore Tubes</button>
            </div>
        `;
    }

    workspace.innerHTML = `
        <style>
            .incubator-rack {
                display: flex; justify-content: center; gap: 40px; padding: 40px; 
                background: ${amylaseState.phase === 'incubating' ? 'radial-gradient(circle, #78350f 0%, #0f172a 80%)' : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'};
                border-radius: 16px; box-shadow: inset 0 -15px 30px rgba(0,0,0,0.6); transition: background 1s ease;
                border: ${amylaseState.phase === 'incubating' ? '2px solid #f59e0b' : 'none'};
            }
            .a-tube {
                width: 48px; height: 200px; border: 2px solid rgba(255,255,255,0.4); border-top: none; border-radius: 0 0 24px 24px; position: relative; background: rgba(255,255,255,0.05); overflow: hidden; box-shadow: inset -5px -5px 15px rgba(0,0,0,0.5);
            }
            .a-fluid {
                position: absolute; bottom: 0; width: 100%; transition: height 0.5s ease, background-color 1s ease; border-radius: 0 0 22px 22px;
            }
            .boil-fx { animation: simmer 0.5s infinite alternate; }
            @keyframes simmer { 0% { transform: scaleY(1); } 100% { transform: scaleY(1.02); box-shadow: inset 0 10px 15px rgba(255,255,255,0.7); } }
        </style>

        <div class="incubator-rack">
            <div style="text-align: center;">
                <span style="color:#94a3b8; font-size:0.75rem;">${totalA}ml / 5ml</span>
                <div class="a-tube ${amylaseState.activeTest === 'benedict' || amylaseState.activeTest === 'millon' ? 'boil-fx' : ''}">
                    <div class="a-fluid" style="height: ${(totalA/5)*60}%; background-color: ${amylaseState.tubes.A.color};"></div>
                </div>
                <h3 style="color:#10b981; margin: 10px 0 2px;">TUBE A</h3>
                <span style="color:#cbd5e1; font-size:0.7rem;">${amylaseState.tubes.A.status}</span>
            </div>
            
            <div style="text-align: center;">
                <span style="color:#94a3b8; font-size:0.75rem;">${totalB}ml / 5ml</span>
                <div class="a-tube ${amylaseState.activeTest === 'benedict' || amylaseState.activeTest === 'millon' ? 'boil-fx' : ''}">
                    <div class="a-fluid" style="height: ${(totalB/5)*60}%; background-color: ${amylaseState.tubes.B.color};"></div>
                </div>
                <h3 style="color:#10b981; margin: 10px 0 2px;">TUBE B</h3>
                <span style="color:#cbd5e1; font-size:0.7rem;">${amylaseState.tubes.B.status}</span>
            </div>

            <div style="text-align: center;">
                <span style="color:#94a3b8; font-size:0.75rem;">${totalC}ml / 5ml</span>
                <div class="a-tube ${amylaseState.activeTest === 'benedict' || amylaseState.activeTest === 'millon' ? 'boil-fx' : ''}">
                    <div class="a-fluid" style="height: ${(totalC/5)*60}%; background-color: ${amylaseState.tubes.C.color};"></div>
                </div>
                <h3 style="color:#10b981; margin: 10px 0 2px;">TUBE C</h3>
                <span style="color:#cbd5e1; font-size:0.7rem;">${amylaseState.tubes.C.status}</span>
            </div>
        </div>
        <div style="width: 100%; margin-top: 20px;">
            ${controlsHtml}
        </div>
    `;
}

function addLiquid(tube, type) {
    if (type === 'starch') amylaseState.tubes[tube].starch = 2;
    if (type === 'water') amylaseState.tubes[tube].water = tube === 'A' ? 3 : 2;
    if (type === 'amylase') amylaseState.tubes[tube].amylase = 3;
    
    amylaseState.tubes[tube].color = '#f8fafc'; // Milky white
    amylaseState.tubes[tube].status = 'Loaded';
    renderLab14_2Canvas(document.getElementById('simulation-render-target'));
}

function startIncubation() {
    amylaseState.phase = 'incubating';
    renderLab14_2Canvas(document.getElementById('simulation-render-target'));
    
    let interval = setInterval(() => {
        amylaseState.timer--;
        renderLab14_2Canvas(document.getElementById('simulation-render-target'));
        
        if (amylaseState.timer <= 0) {
            clearInterval(interval);
            amylaseState.phase = 'ready';
            // Hydrolysis occurs in Tube C behind the scenes!
            restorePostIncubation();
        }
    }, 1000);
}

function restorePostIncubation() {
    amylaseState.activeTest = null;
    ['A', 'B', 'C'].forEach(t => {
        amylaseState.tubes[t].color = '#f8fafc';
        amylaseState.tubes[t].status = 'Incubated (37°C)';
    });
    renderLab14_2Canvas(document.getElementById('simulation-render-target'));
}

function runAmylaseTest(testName) {
    amylaseState.activeTest = testName;
    
    if (testName === 'iodine') {
        amylaseState.tubes.A.color = '#1e3a8a'; // Blue-Black (Starch present)
        amylaseState.tubes.A.status = 'Blue-Black';
        
        amylaseState.tubes.B.color = '#b45309'; // Yellow/Brown (No starch)
        amylaseState.tubes.B.status = 'Yellow/Brown';
        
        amylaseState.tubes.C.color = '#b45309'; // Yellow/Brown (Starch was hydrolyzed!)
        amylaseState.tubes.C.status = 'Yellow/Brown (Hydrolyzed)';
    } 
    else if (testName === 'benedict') {
        amylaseState.tubes.A.color = '#3b82f6'; // Remains Blue
        amylaseState.tubes.A.status = 'Heated: Blue';
        
        amylaseState.tubes.B.color = '#3b82f6'; // Remains Blue
        amylaseState.tubes.B.status = 'Heated: Blue';
        
        amylaseState.tubes.C.color = '#ea580c'; // Brick-Red/Orange (Maltose present)
        amylaseState.tubes.C.status = 'Heated: Brick-Red Ppt';
    }
    else if (testName === 'millon') {
        // Millon's tests for proteins (Amylase is a protein)
        amylaseState.tubes.A.color = '#f8fafc'; // Clear/White
        amylaseState.tubes.A.status = 'Heated: Clear';
        
        amylaseState.tubes.B.color = '#be123c'; // Red Precipitate (Enzyme present)
        amylaseState.tubes.B.status = 'Heated: Red Ppt';
        
        amylaseState.tubes.C.color = '#be123c'; // Red Precipitate (Enzyme present)
        amylaseState.tubes.C.status = 'Heated: Red Ppt';
    }
    
    renderLab14_2Canvas(document.getElementById('simulation-render-target'));
}

function renderLab14_2Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            <h4 style="color: #38bdf8; font-family: 'Poppins'; margin-top: 0;">Part 1: Iodine Test (Starch Hydrolysis)</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead><tr><th>Tube</th><th>Color Before I₂</th><th>Color After I₂</th><th>Was Starch Hydrolyzed? Why?</th></tr></thead>
                    <tbody>
                        <tr><td>A</td>
                            <td><input type="text" class="sim-input" id="rep_io_bef_a" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="rep_io_aft_a" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="rep_io_inf_a" placeholder="State reason..."></td>
                        </tr>
                        <tr><td>B</td>
                            <td><input type="text" class="sim-input" id="rep_io_bef_b" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="rep_io_aft_b" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="rep_io_inf_b" placeholder="State reason..."></td>
                        </tr>
                        <tr><td>C</td>
                            <td><input type="text" class="sim-input" id="rep_io_bef_c" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="rep_io_aft_c" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="rep_io_inf_c" placeholder="State reason..."></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4 style="color: #38bdf8; font-family: 'Poppins';">Part 2: Reducing Sugar & Protein Tests</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead><tr><th>Test</th><th>Tube A Obs/Inf</th><th>Tube B Obs/Inf</th><th>Tube C Obs/Inf</th></tr></thead>
                    <tbody>
                        <tr>
                            <td><strong>Benedict's</strong></td>
                            <td><input type="text" class="sim-input" id="rep_ben_a" placeholder="Obs & Inference"></td>
                            <td><input type="text" class="sim-input" id="rep_ben_b" placeholder="Obs & Inference"></td>
                            <td><input type="text" class="sim-input" id="rep_ben_c" placeholder="Obs & Inference"></td>
                        </tr>
                        <tr>
                            <td><strong>Millon's (Protein)</strong></td>
                            <td><input type="text" class="sim-input" id="rep_pro_a" placeholder="Obs & Inference"></td>
                            <td><input type="text" class="sim-input" id="rep_pro_b" placeholder="Obs & Inference"></td>
                            <td><input type="text" class="sim-input" id="rep_pro_c" placeholder="Obs & Inference"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4 style="color: #38bdf8; font-family: 'Poppins';">Part 3: Theoretical Deductions</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <input type="text" class="sim-input" id="rep_th_1" placeholder="a. What product is produced when starch is digested?">
                <input type="text" class="sim-input" id="rep_th_2" placeholder="b. What is amylase and its role in this experiment?">
                <input type="text" class="sim-input" id="rep_th_3" placeholder="c. Identify the control tubes and their specific roles.">
            </div>
        </div>
    `;
}

/* ==========================================================================
   LAB 14.3: GERMINATING MAIZE SEEDS (CRUSH, FILTER & TEST ENGINE)
   ========================================================================== */

let maizeState = {
    phase: 'prep', // 'prep' (crushing/filtering) -> 'test' (chemical testing)
    isExtracting: false,
    activeTest: null,
    tubeVolume: 0,
    tubeColor: 'rgba(255,255,255,0)',
    tubeStatus: 'Empty',
    heated: false
};

function initLab14_3Engine(workspace, tableContainer) {
    maizeState = { phase: 'prep', isExtracting: false, activeTest: null, tubeVolume: 0, tubeColor: 'rgba(255,255,255,0)', tubeStatus: 'Empty', heated: false };
    renderLab14_3Canvas(workspace);
    renderLab14_3Table(tableContainer);
    showLab14_3Intro();
}

function showLab14_3Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #10b981; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(16, 185, 129, 0.2); color: #fff;">
                <h2 style="color: #10b981; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-seedling"></i> Germinating Seed Analysis</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>You cannot test solid seeds directly in test tubes. You must first extract the biomolecules.</li>
                        <li><strong>Step 1:</strong> Use the Mortar & Pestle controls to crush the germinating maize, add water, and filter the suspension.</li>
                        <li><strong>Step 2:</strong> Once the filtrate is collected, the chemical testing apparatus will unlock.</li>
                        <li><strong>Hint:</strong> Think about the biology of a <em>germinating</em> seed. What is happening to its stored starch? Why are enzymes active?</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #10b981; color: #fff; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Acknowledge & Begin</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab14_3Canvas(workspace) {
    let uiHtml = '';

    if (maizeState.phase === 'prep') {
        uiHtml = `
            <div style="text-align: center; width: 100%;">
                <h3 style="color: #38bdf8; font-family: 'Poppins'; margin-bottom: 20px;"><i class="fas fa-mortar-pestle"></i> Extraction Phase</h3>
                <div style="background: #0f172a; padding: 30px; border-radius: 16px; border: 1px dashed #334155; display: inline-block;">
                    <i class="fas ${maizeState.isExtracting ? 'fa-cog fa-spin' : 'fa-seedling'} fa-4x" style="color: ${maizeState.isExtracting ? '#10b981' : '#f59e0b'}; margin-bottom: 20px;"></i>
                    <p style="color: #cbd5e1; margin-bottom: 20px;" id="prep-status-text">${maizeState.isExtracting ? 'Crushing, dissolving, and filtering...' : '5 Germinating Maize Seeds ready for extraction.'}</p>
                    <button id="btn-extract" onclick="runExtraction()" style="background: var(--emerald); color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; transition: 0.2s;">
                        <i class="fas fa-play"></i> Crush, Add Water & Filter
                    </button>
                </div>
            </div>
        `;
    } else {
        uiHtml = `
            <div class="lab-stage" style="display: flex; flex-wrap: wrap; width: 100%; gap: 20px; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 25px; box-shadow: inset 0 -15px 30px rgba(0,0,0,0.6);">
                <div class="test-selector-panel" style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 10px;">
                    <span style="color: #10b981; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">1. Select Test (Using Filtrate)</span>
                    <button class="test-btn ${maizeState.activeTest === 'starch' ? 'active' : ''}" style="background: ${maizeState.activeTest === 'starch' ? '#10b981' : '#1e293b'}; color: ${maizeState.activeTest === 'starch' ? '#fff' : '#94a3b8'}; border: 1px solid #334155; padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Poppins'; font-weight: 600; text-align: left;" onclick="selectMaizeTest('starch')">Test for Starch</button>
                    <button class="test-btn ${maizeState.activeTest === 'reducing' ? 'active' : ''}" style="background: ${maizeState.activeTest === 'reducing' ? '#10b981' : '#1e293b'}; color: ${maizeState.activeTest === 'reducing' ? '#fff' : '#94a3b8'}; border: 1px solid #334155; padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Poppins'; font-weight: 600; text-align: left;" onclick="selectMaizeTest('reducing')">Test for Reducing Sugars</button>
                    <button class="test-btn ${maizeState.activeTest === 'proteins' ? 'active' : ''}" style="background: ${maizeState.activeTest === 'proteins' ? '#10b981' : '#1e293b'}; color: ${maizeState.activeTest === 'proteins' ? '#fff' : '#94a3b8'}; border: 1px solid #334155; padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Poppins'; font-weight: 600; text-align: left;" onclick="selectMaizeTest('proteins')">Test for Proteins</button>
                </div>

                <div class="tube-display-panel" style="flex: 1; min-width: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <span style="color: #cbd5e1; margin-bottom: 10px; font-family: 'Poppins'; font-size: 0.9rem;">${maizeState.activeTest ? 'Active: ' + maizeState.activeTest.toUpperCase() : 'Awaiting Selection'}</span>
                    
                    <div class="master-tube ${maizeState.heated ? 'boiling' : ''}" style="width: 60px; height: 240px; border: 3px solid rgba(255, 255, 255, 0.4); border-top: none; border-radius: 0 0 30px 30px; position: relative; background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.0) 50%, rgba(255,255,255,0.1) 100%); box-shadow: inset -5px -5px 15px rgba(0,0,0,0.5); overflow: hidden; ${maizeState.heated ? 'animation: boil 0.8s infinite alternate;' : ''}">
                        <div class="fluid" style="position: absolute; bottom: 0; width: 100%; height: ${maizeState.tubeVolume}%; background-color: ${maizeState.tubeColor}; transition: background-color 1s ease, height 0.8s ease; border-radius: 0 0 27px 27px; box-shadow: inset 0 10px 15px rgba(255,255,255,0.3);"></div>
                    </div>
                    
                    <span style="color: #94a3b8; margin-top: 15px; font-size: 0.8rem; text-align: center;">${maizeState.tubeStatus}</span>
                </div>

                <div class="reagent-shelf" style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; border: 1px dashed #334155;">
                    <span style="color: #38bdf8; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">2. Reagents & Actions</span>
                    ${getMaizeReagents()}
                </div>
            </div>
            <style>
                @keyframes boil { 0% { transform: scaleY(1); box-shadow: inset 0 10px 15px rgba(255,255,255,0.4), 0 0 20px rgba(239, 68, 68, 0.5); } 100% { transform: scaleY(1.03); box-shadow: inset 0 10px 15px rgba(255,255,255,0.7), 0 0 35px rgba(239, 68, 68, 0.8); } }
            </style>
        `;
    }

    workspace.innerHTML = uiHtml;
}

function runExtraction() {
    maizeState.isExtracting = true;
    renderLab14_3Canvas(document.getElementById('simulation-render-target'));
    
    setTimeout(() => {
        maizeState.phase = 'test';
        renderLab14_3Canvas(document.getElementById('simulation-render-target'));
    }, 2500); // 2.5 second dramatic loading animation
}

function selectMaizeTest(testName) {
    maizeState.activeTest = testName;
    maizeState.tubeVolume = 30;
    maizeState.tubeColor = 'rgba(245, 245, 220, 0.8)'; // Pale cloudy beige (maize filtrate)
    maizeState.tubeStatus = '2cm³ Maize Filtrate';
    maizeState.heated = false;
    renderLab14_3Canvas(document.getElementById('simulation-render-target'));
}

function getMaizeReagents() {
    if (!maizeState.activeTest) return `<p style="color: #64748b; font-size: 0.85rem;">Select a test first.</p>`;
    
    let btns = '';
    const btnStyle = "background: #38bdf8; color: #0f172a; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px;";
    const heatStyle = "background: #ef4444; color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px;";

    if (maizeState.activeTest === 'starch') {
        btns += `<button style="${btnStyle}" onclick="applyMaizeReagent('iodine')"><i class="fas fa-eye-dropper"></i> Add Iodine (I₂/KI)</button>`;
    } else if (maizeState.activeTest === 'reducing') {
        btns += `<button style="${btnStyle}" onclick="applyMaizeReagent('benedict')"><i class="fas fa-vial"></i> Add Benedict's</button>
                 <button style="${heatStyle}" onclick="applyMaizeReagent('heat')"><i class="fas fa-fire"></i> Heat in Water Bath</button>`;
    } else if (maizeState.activeTest === 'proteins') {
        btns += `<button style="${btnStyle}" onclick="applyMaizeReagent('biuret')"><i class="fas fa-eye-dropper"></i> Add Biuret Reagent</button>`;
    }
    return btns;
}

function applyMaizeReagent(action) {
    if (action === 'iodine') {
        maizeState.tubeVolume = 40;
        maizeState.tubeColor = '#0f172a'; // Deep Blue-Black (Starch is heavily present)
        maizeState.tubeStatus = 'Filtrate + Iodine<br><strong>Blue-Black</strong>';
    } else if (action === 'benedict') {
        maizeState.tubeVolume = 50;
        maizeState.tubeColor = '#3b82f6'; // Blue
        maizeState.tubeStatus = 'Filtrate + Benedict\'s<br>Blue';
    } else if (action === 'biuret') {
        maizeState.tubeVolume = 50;
        maizeState.tubeColor = '#8b5cf6'; // Violet/Purple (Proteins present)
        maizeState.tubeStatus = 'Filtrate + Biuret<br><strong>Violet/Purple</strong>';
    } else if (action === 'heat' && maizeState.activeTest === 'reducing') {
        maizeState.heated = true;
        maizeState.tubeStatus = 'Heating...';
        renderLab14_3Canvas(document.getElementById('simulation-render-target'));
        
        setTimeout(() => {
            maizeState.heated = false;
            maizeState.tubeColor = '#dc2626'; // Brick Red (Reducing sugars present due to germination!)
            maizeState.tubeStatus = 'Heated<br><strong>Brick-Red Precipitate</strong>';
            renderLab14_3Canvas(document.getElementById('simulation-render-target'));
        }, 2000);
        return; // Return early so we don't re-render immediately while heating
    }

    renderLab14_3Canvas(document.getElementById('simulation-render-target'));
}

function renderLab14_3Table(tableContainer) {
    tableContainer.innerHTML = `
        <div class="table-responsive-wrapper">
            <table class="sim-table">
                <thead>
                    <tr>
                        <th style="width: 20%;">Test Target</th>
                        <th style="width: 25%;">Procedure</th>
                        <th style="width: 25%;">Observation / Result</th>
                        <th style="width: 30%;">Biological Explanation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>a. Starch</strong></td>
                        <td><input type="text" class="sim-input" id="rep_proc_starch" placeholder="Steps taken?"></td>
                        <td><input type="text" class="sim-input" id="rep_obs_starch" placeholder="Final color?"></td>
                        <td><textarea class="sim-input" id="rep_exp_starch" rows="2" placeholder="Why is this molecule present in the seed?"></textarea></td>
                    </tr>
                    <tr>
                        <td><strong>b. Reducing Sugars</strong></td>
                        <td><input type="text" class="sim-input" id="rep_proc_red" placeholder="Steps taken?"></td>
                        <td><input type="text" class="sim-input" id="rep_obs_red" placeholder="Final color?"></td>
                        <td><textarea class="sim-input" id="rep_exp_red" rows="2" placeholder="Where did reducing sugars come from during germination?"></textarea></td>
                    </tr>
                    <tr>
                        <td><strong>c. Proteins</strong></td>
                        <td><input type="text" class="sim-input" id="rep_proc_prot" placeholder="Steps taken?"></td>
                        <td><input type="text" class="sim-input" id="rep_obs_prot" placeholder="Final color?"></td>
                        <td><textarea class="sim-input" id="rep_exp_prot" rows="2" placeholder="What role do proteins play in germination?"></textarea></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

/* ==========================================================================
   LAB 15.1: CATALASE ENZYMES (LIVER EXTRACT & EFFERVESCENCE ENGINE)
   ========================================================================== */

let catalaseState = {
    phase: 'prep', // 'prep' -> 'test'
    isExtracting: false,
    h2o2Added: false,
    bubbleInterval: null
};

function initLab15_1Engine(workspace, tableContainer) {
    catalaseState = { phase: 'prep', isExtracting: false, h2o2Added: false, bubbleInterval: null };
    renderLab15_1Canvas(workspace);
    renderLab15_1Table(tableContainer);
    showLab15_1Intro();
}

function showLab15_1Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #38bdf8; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(56, 189, 248, 0.2); color: #fff;">
                <h2 style="color: #38bdf8; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-dna"></i> Enzyme Catalysis Setup</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>Catalase is an intracellular enzyme. To access it, you must physically rupture the cell membranes of the liver tissue.</li>
                        <li><strong>Step 1:</strong> Use the Mortar & Pestle to homogenize the liver tissue and extract the enzyme into a solution.</li>
                        <li><strong>Step 2:</strong> The system will automatically setup Tube A (Liver Extract) and Tube B (Distilled Water).</li>
                        <li><strong>Step 3:</strong> Add Hydrogen Peroxide (H₂O₂) and observe the physiological response.</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #38bdf8; color: #0f172a; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Acknowledge & Begin</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab15_1Canvas(workspace) {
    let uiHtml = '';

    if (catalaseState.phase === 'prep') {
        uiHtml = `
            <div style="text-align: center; width: 100%;">
                <h3 style="color: #38bdf8; font-family: 'Poppins'; margin-bottom: 20px;"><i class="fas fa-mortar-pestle"></i> Tissue Homogenization</h3>
                <div style="background: #0f172a; padding: 30px; border-radius: 16px; border: 1px dashed #334155; display: inline-block;">
                    <i class="fas ${catalaseState.isExtracting ? 'fa-cog fa-spin' : 'fa-drumstick-bite'} fa-4x" style="color: ${catalaseState.isExtracting ? '#38bdf8' : '#ef4444'}; margin-bottom: 20px;"></i>
                    <p style="color: #cbd5e1; margin-bottom: 20px;" id="prep-status-text">${catalaseState.isExtracting ? 'Rupturing hepatocytes & filtering...' : 'Raw mammalian liver tissue ready for extraction.'}</p>
                    <button id="btn-extract" onclick="runCatalaseExtraction()" style="background: #ef4444; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; transition: 0.2s;">
                        <i class="fas fa-play"></i> Crush Liver & Filter Extract
                    </button>
                </div>
            </div>
        `;
    } else {
        uiHtml = `
            <style>
                .catalase-rack { display: flex; justify-content: center; gap: 50px; padding: 30px; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; box-shadow: inset 0 -15px 30px rgba(0,0,0,0.6); margin-bottom: 20px; }
                .c-tube { width: 50px; height: 220px; border: 2px solid rgba(255,255,255,0.4); border-top: none; border-radius: 0 0 25px 25px; position: relative; background: rgba(255,255,255,0.05); overflow: hidden; box-shadow: inset -5px -5px 15px rgba(0,0,0,0.5); }
                .c-fluid { position: absolute; bottom: 0; width: 100%; transition: height 0.5s ease; border-radius: 0 0 23px 23px; }
                
                /* Bubble Animation System */
                .o2-bubble { position: absolute; background: rgba(255, 255, 255, 0.9); border-radius: 50%; bottom: 0; animation: rise 1s infinite ease-in; box-shadow: inset -1px -1px 3px rgba(0,0,0,0.3); }
                @keyframes rise {
                    0% { bottom: 0; transform: scale(0.5) translateX(0); opacity: 1; }
                    100% { bottom: 100%; transform: scale(1.5) translateX(-15px); opacity: 0; }
                }
                .froth { position: absolute; top: 0; left: 0; width: 100%; height: 20px; background: rgba(255,255,255,0.8); border-radius: 5px; opacity: 0; transition: opacity 1s ease; }
                .frothing .froth { opacity: 1; animation: frothPulse 0.5s infinite alternate; }
                @keyframes frothPulse { 0% { transform: scaleY(1); } 100% { transform: scaleY(1.3); } }
            </style>

            <div style="width: 100%;">
                <div class="catalase-rack">
                    <div style="text-align: center;">
                        <div class="c-tube" id="tube-a">
                            <div class="c-fluid" style="height: ${catalaseState.h2o2Added ? '50%' : '40%'}; background-color: rgba(180, 83, 9, 0.6);">
                                <div class="froth"></div>
                            </div>
                        </div>
                        <h3 style="color:#38bdf8; margin: 10px 0 2px; font-family:'Poppins';">TUBE A</h3>
                        <span style="color:#cbd5e1; font-size:0.75rem;">Liver Extract</span>
                    </div>

                    <div style="text-align: center;">
                        <div class="c-tube" id="tube-b">
                            <div class="c-fluid" style="height: ${catalaseState.h2o2Added ? '50%' : '40%'}; background-color: rgba(255, 255, 255, 0.2);"></div>
                        </div>
                        <h3 style="color:#94a3b8; margin: 10px 0 2px; font-family:'Poppins';">TUBE B</h3>
                        <span style="color:#cbd5e1; font-size:0.75rem;">Distilled Water</span>
                    </div>
                </div>

                <div style="text-align: center;">
                    <button id="btn-add-peroxide" onclick="addHydrogenPeroxide()" ${catalaseState.h2o2Added ? 'disabled' : ''} style="background: ${catalaseState.h2o2Added ? '#475569' : '#38bdf8'}; color: ${catalaseState.h2o2Added ? '#fff' : '#0f172a'}; border: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor: ${catalaseState.h2o2Added ? 'not-allowed' : 'pointer'}; transition: 0.2s; font-family: 'Poppins';">
                        <i class="fas fa-eye-dropper"></i> ${catalaseState.h2o2Added ? 'H₂O₂ Added' : 'Add Hydrogen Peroxide (H₂O₂)'}
                    </button>
                    ${catalaseState.h2o2Added ? '<p style="color: #10b981; margin-top: 10px; font-weight: bold;"><i class="fas fa-check-circle"></i> Reaction observed.</p>' : ''}
                </div>
            </div>
        `;
    }

    workspace.innerHTML = uiHtml;
}

function runCatalaseExtraction() {
    catalaseState.isExtracting = true;
    renderLab15_1Canvas(document.getElementById('simulation-render-target'));
    
    setTimeout(() => {
        catalaseState.phase = 'test';
        renderLab15_1Canvas(document.getElementById('simulation-render-target'));
    }, 2000);
}

function addHydrogenPeroxide() {
    catalaseState.h2o2Added = true;
    renderLab15_1Canvas(document.getElementById('simulation-render-target'));

    // Trigger the effervescence inside Tube A ONLY
    const tubeAFluid = document.querySelector('#tube-a .c-fluid');
    tubeAFluid.classList.add('frothing');

    catalaseState.bubbleInterval = setInterval(() => {
        let bubble = document.createElement('div');
        bubble.classList.add('o2-bubble');
        
        // Randomize bubble size and horizontal position
        let size = Math.random() * 8 + 4;
        let leftPos = Math.random() * 40 + 5;
        let duration = Math.random() * 0.5 + 0.5;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${leftPos}px`;
        bubble.style.animationDuration = `${duration}s`;

        tubeAFluid.appendChild(bubble);

        // Remove bubble after animation ends
        setTimeout(() => {
            if(tubeAFluid.contains(bubble)) bubble.remove();
        }, duration * 1000);

    }, 50); // Generates a new bubble every 50ms (Rapid effervescence!)
}

function renderLab15_1Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">a. Suggest a title for this experiment:</label>
                <input type="text" class="sim-input" id="rep_title" placeholder="Type title here...">
            </div>

            <div style="margin-bottom: 25px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">b. Describe your procedure and precautions taken to obtain accurate results:</label>
                <textarea class="sim-input" id="rep_proc" rows="3" placeholder="Describe grinding the liver, equal volumes used, etc..."></textarea>
            </div>

            <h4 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 10px;">c. What happened when H₂O₂ was added to Tube A?</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead><tr><th style="width: 50%;">Observation Test Tube A</th><th style="width: 50%;">Inference (Explanation)</th></tr></thead>
                    <tbody>
                        <tr>
                            <td><textarea class="sim-input" id="rep_a_obs" rows="2" placeholder="What did you see?"></textarea></td>
                            <td><textarea class="sim-input" id="rep_a_inf" rows="2" placeholder="Why did this happen?"></textarea></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4 style="color: #94a3b8; font-family: 'Poppins'; margin-bottom: 10px;">d. What happened in Tube B? What was the purpose of water in Tube B?</h4>
            <div class="table-responsive-wrapper">
                <table class="sim-table">
                    <thead><tr><th style="width: 50%;">Observation Test Tube B</th><th style="width: 50%;">Inference (Purpose)</th></tr></thead>
                    <tbody>
                        <tr>
                            <td><textarea class="sim-input" id="rep_b_obs" rows="2" placeholder="What did you see?"></textarea></td>
                            <td><textarea class="sim-input" id="rep_b_inf" rows="2" placeholder="Why did we include this tube?"></textarea></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    `;
}

/* ==========================================================================
   LAB 15.2: EFFECT OF TEMPERATURE ON ENZYME ACTIVITY (4-CHAMBER ENGINE)
   ========================================================================== */

let tempState = {
    phase: 'setup', // 'setup', 'incubating', 'ready', 'reacted'
    timer: 10,
    intervals: [] // Stores the bubble animation loops so we can clear them
};

function initLab15_2Engine(workspace, tableContainer) {
    tempState = { phase: 'setup', timer: 10, intervals: [] };
    renderLab15_2Canvas(workspace);
    renderLab15_2Table(tableContainer);
}

function renderLab15_2Canvas(workspace) {
    let controlsHtml = '';
    
    if (tempState.phase === 'setup') {
        controlsHtml = `
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="startTempIncubation()" style="background: #e74c3c; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4); transition: 0.2s;">
                    <i class="fas fa-thermometer-half"></i> Incubate all tubes for 10 Minutes
                </button>
            </div>
        `;
    } else if (tempState.phase === 'incubating') {
        controlsHtml = `
            <div style="text-align: center; color: #f59e0b; margin-top: 20px;">
                <i class="fas fa-spinner fa-spin fa-2x" style="margin-bottom: 10px;"></i>
                <h3 style="font-family: 'Orbitron', sans-serif; letter-spacing: 2px; margin: 0;">THERMAL EQUILIBRATION IN PROGRESS</h3>
                <p style="font-size: 1.2rem; font-weight: bold; margin: 5px 0;">Time Remaining: ${tempState.timer} Mins (Simulated)</p>
            </div>
        `;
    } else if (tempState.phase === 'ready') {
        controlsHtml = `
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="dispenseH2O2()" style="background: #38bdf8; color: #0f172a; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); transition: 0.2s;">
                    <i class="fas fa-eye-dropper"></i> Dispense 1ml H₂O₂ into all tubes
                </button>
            </div>
        `;
    } else if (tempState.phase === 'reacted') {
        controlsHtml = `
            <div style="text-align: center; margin-top: 20px; color: #10b981;">
                <h3 style="font-family: 'Poppins'; margin: 0;"><i class="fas fa-check-circle"></i> Reaction Complete</h3>
                <p style="font-size: 0.9rem; margin-top: 5px; color: #94a3b8;">Observe the variations in effervescence and log your deductions.</p>
                <button onclick="initLab15_2Engine(document.getElementById('simulation-render-target'), document.getElementById('dynamic-data-table-container'))" style="margin-top: 10px; background: #475569; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-family: 'Poppins';"><i class="fas fa-undo"></i> Reset Apparatus</button>
            </div>
        `;
    }

    workspace.innerHTML = `
        <style>
            .incubator-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 20px; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); }
            .bath-chamber { flex: 1; min-width: 120px; max-width: 160px; height: 220px; border-radius: 12px; position: relative; display: flex; justify-content: center; align-items: flex-end; padding-bottom: 20px; border: 2px solid #334155; overflow: hidden; }
            
            /* Distinct Bath Environments */
            .bath-ice { background: rgba(56, 189, 248, 0.1); border-color: #38bdf8; box-shadow: inset 0 0 20px rgba(56, 189, 248, 0.2); }
            .bath-room { background: rgba(16, 185, 129, 0.1); border-color: #10b981; }
            .bath-warm { background: rgba(245, 158, 11, 0.1); border-color: #f59e0b; }
            .bath-boil { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.3); }
            
            /* Floating Ice */
            .ice-cube { position: absolute; width: 20px; height: 20px; background: rgba(255,255,255,0.7); border-radius: 4px; top: 40px; animation: float 3s infinite ease-in-out alternate; }
            @keyframes float { 0% { transform: translateY(0); } 100% { transform: translateY(5px); } }
            
            /* Boiling Bubbles */
            .boil-bubble { position: absolute; background: rgba(255,255,255,0.5); border-radius: 50%; bottom: 0; animation: boilRise 0.6s infinite ease-in; }
            @keyframes boilRise { 0% { bottom: 0; opacity: 1; transform: scale(0.5); } 100% { bottom: 100%; opacity: 0; transform: scale(1.5); } }

            .test-tube { width: 34px; height: 160px; border: 2px solid rgba(255,255,255,0.6); border-top: none; border-radius: 0 0 17px 17px; position: relative; background: rgba(255,255,255,0.1); overflow: hidden; z-index: 10; }
            .fluid { position: absolute; bottom: 0; width: 100%; transition: height 0.5s ease; border-radius: 0 0 15px 15px; }
            
            /* Enzyme Reaction Bubbles */
            .enz-bubble { position: absolute; background: rgba(255, 255, 255, 0.9); border-radius: 50%; bottom: 0; animation: enzRise linear forwards; box-shadow: inset -1px -1px 2px rgba(0,0,0,0.4); }
            @keyframes enzRise { 0% { bottom: 0; transform: scale(0.5) translateX(0); opacity: 1; } 100% { bottom: 100%; transform: scale(1.2) translateX(calc(-5px + 10px * var(--rand))); opacity: 0; } }
            
            .froth { position: absolute; top: 0; left: 0; width: 100%; background: rgba(255,255,255,0.85); border-radius: 5px; transition: height 1s ease; }
            
            .bath-label { position: absolute; top: 10px; width: 100%; text-align: center; font-family: 'Poppins'; font-weight: bold; font-size: 0.85rem; z-index: 20; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
        </style>

        <div class="incubator-grid">
            <!-- TUBE P: ICE BATH -->
            <div class="bath-chamber bath-ice">
                <div class="bath-label" style="color: #38bdf8;">TUBE P<br><span style="font-size:0.7rem; color:#cbd5e1;">-4°C (Ice)</span></div>
                <div class="ice-cube" style="left: 20px; animation-delay: 0s;"></div>
                <div class="ice-cube" style="right: 20px; animation-delay: 1.5s;"></div>
                <div class="test-tube" id="tube-p">
                    <div class="fluid" style="height: ${tempState.phase === 'reacted' ? '50%' : '40%'}; background-color: rgba(180, 83, 9, 0.6);">
                        <div class="froth" id="froth-p" style="height: 0;"></div>
                    </div>
                </div>
            </div>

            <!-- TUBE Q: ROOM TEMP -->
            <div class="bath-chamber bath-room">
                <div class="bath-label" style="color: #10b981;">TUBE Q<br><span style="font-size:0.7rem; color:#cbd5e1;">25°C (Room)</span></div>
                <div class="test-tube" id="tube-q">
                    <div class="fluid" style="height: ${tempState.phase === 'reacted' ? '50%' : '40%'}; background-color: rgba(180, 83, 9, 0.6);">
                        <div class="froth" id="froth-q" style="height: 0;"></div>
                    </div>
                </div>
            </div>

            <!-- TUBE R: WARM -->
            <div class="bath-chamber bath-warm">
                <div class="bath-label" style="color: #f59e0b;">TUBE R<br><span style="font-size:0.7rem; color:#cbd5e1;">60°C (Warm)</span></div>
                <div class="test-tube" id="tube-r">
                    <div class="fluid" style="height: ${tempState.phase === 'reacted' ? '50%' : '40%'}; background-color: rgba(180, 83, 9, 0.6);">
                        <div class="froth" id="froth-r" style="height: 0;"></div>
                    </div>
                </div>
            </div>

            <!-- TUBE S: BOILING -->
            <div class="bath-chamber bath-boil" id="bath-boil">
                <div class="bath-label" style="color: #ef4444;">TUBE S<br><span style="font-size:0.7rem; color:#cbd5e1;">100°C (Boil)</span></div>
                <div class="test-tube" id="tube-s">
                    <div class="fluid" style="height: ${tempState.phase === 'reacted' ? '50%' : '40%'}; background-color: rgba(180, 83, 9, 0.5);">
                        <div class="froth" id="froth-s" style="height: 0;"></div>
                    </div>
                </div>
            </div>
        </div>

        ${controlsHtml}
    `;

    // Re-attach boiling bubbles if phase is setup/incubating/ready
    if (tempState.phase !== 'reacted') {
        const boilChamber = document.getElementById('bath-boil');
        if (boilChamber) {
            for(let i=0; i<8; i++) {
                let b = document.createElement('div');
                b.className = 'boil-bubble';
                b.style.left = Math.random() * 90 + 5 + '%';
                b.style.width = Math.random() * 8 + 4 + 'px';
                b.style.height = b.style.width;
                b.style.animationDelay = Math.random() * 0.6 + 's';
                boilChamber.appendChild(b);
            }
        }
    }
}

function startTempIncubation() {
    tempState.phase = 'incubating';
    renderLab15_2Canvas(document.getElementById('simulation-render-target'));
    
    let countdown = setInterval(() => {
        tempState.timer--;
        renderLab15_2Canvas(document.getElementById('simulation-render-target'));
        
        if (tempState.timer <= 0) {
            clearInterval(countdown);
            tempState.phase = 'ready';
            renderLab15_2Canvas(document.getElementById('simulation-render-target'));
        }
    }, 500); // Fast-forwarded time
}

function dispenseH2O2() {
    tempState.phase = 'reacted';
    renderLab15_2Canvas(document.getElementById('simulation-render-target'));

    // Trigger Enzyme Kinetics Animations based on Temperature!
    // P (-4C) = Inactive (Very slow)
    // Q (25C) = Optimum/High (Wild frothing)
    // R (60C) = Denaturing (Very slow/almost stopped)
    // S (100C) = Denatured (Dead)

    triggerEffervescence('tube-p', 'froth-p', 600, 5);  // 1 bubble every 600ms, small froth
    triggerEffervescence('tube-q', 'froth-q', 30, 40);  // 1 bubble every 30ms, massive froth!
    triggerEffervescence('tube-r', 'froth-r', 800, 3);  // 1 bubble every 800ms, tiny froth
    // Tube S gets NOTHING.
}

function triggerEffervescence(tubeId, frothId, speedMs, frothHeight) {
    const tubeFluid = document.querySelector(`#${tubeId} .fluid`);
    const froth = document.getElementById(frothId);
    
    if (!tubeFluid || !froth) return;

    // Grow the froth layer
    froth.style.height = `${frothHeight}px`;

    // Generate bubbles
    let interval = setInterval(() => {
        let bubble = document.createElement('div');
        bubble.classList.add('enz-bubble');
        
        let size = Math.random() * 6 + 2;
        let leftPos = Math.random() * 80 + 10;
        let duration = Math.random() * 0.4 + 0.4;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${leftPos}%`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.setProperty('--rand', Math.random()); // For erratic movement

        tubeFluid.appendChild(bubble);

        setTimeout(() => {
            if(tubeFluid.contains(bubble)) bubble.remove();
        }, duration * 1000);

    }, speedMs);

    tempState.intervals.push(interval);
    
    // Stop bubbling after 8 seconds to save CPU
    setTimeout(() => {
        clearInterval(interval);
    }, 8000);
}

function renderLab15_2Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">a. Propose a possible hypothesis for this experiment:</label>
                <input type="text" class="sim-input" id="rep_hyp" placeholder="e.g. As temperature increases...">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">b. Identify the variables involved:</label>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <input type="text" class="sim-input" id="rep_iv" placeholder="i. Independent Variable (altered factor)">
                    <input type="text" class="sim-input" id="rep_dv" placeholder="ii. Dependent Variable (measured factor)">
                    <input type="text" class="sim-input" id="rep_cv" placeholder="iii. Two Controlled Variables (kept constant)">
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">c. Describe your procedure and precautions:</label>
                <textarea class="sim-input" id="rep_proc" rows="2" placeholder="Briefly summarize steps and safety..."></textarea>
            </div>

            <h4 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 10px;">d. Record your observations:</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead><tr><th style="width: 50%;">Incubation Condition (10 mins)</th><th style="width: 50%;">Degree of fizzing after adding H₂O₂</th></tr></thead>
                    <tbody>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube P:</strong> -4°C (Ice Water)</td><td><input type="text" class="sim-input" id="obs_p" placeholder="..."></td></tr>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube Q:</strong> 25°C (Room Temp)</td><td><input type="text" class="sim-input" id="obs_q" placeholder="..."></td></tr>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube R:</strong> 60°C (Warm)</td><td><input type="text" class="sim-input" id="obs_r" placeholder="..."></td></tr>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube S:</strong> 100°C (Boiling)</td><td><input type="text" class="sim-input" id="obs_s" placeholder="..."></td></tr>
                    </tbody>
                </table>
            </div>

            <h4 style="color: #94a3b8; font-family: 'Poppins'; margin-bottom: 10px;">e. Interpret your results (Why did it happen?):</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                <input type="text" class="sim-input" id="inf_p" placeholder="Explanation for Tube P...">
                <input type="text" class="sim-input" id="inf_q" placeholder="Explanation for Tube Q...">
                <input type="text" class="sim-input" id="inf_r" placeholder="Explanation for Tube R...">
                <input type="text" class="sim-input" id="inf_s" placeholder="Explanation for Tube S...">
            </div>

            <div style="margin-bottom: 10px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">f. Do your results confirm or refute the hypothesis?</label>
                <input type="text" class="sim-input" id="rep_conf" placeholder="Yes/No, because...">
            </div>
        </div>
    `;
}

/* ==========================================================================
   LAB 15.3: EFFECT OF PH ON ENZYME ACTIVITY (3-CHAMBER ENGINE)
   ========================================================================== */

let phState = {
    phase: 'setup', // 'setup', 'ready', 'reacted'
    intervals: []
};

function initLab15_3Engine(workspace, tableContainer) {
    phState = { phase: 'setup', intervals: [] };
    renderLab15_3Canvas(workspace);
    renderLab15_3Table(tableContainer);
}

function renderLab15_3Canvas(workspace) {
    let controlsHtml = '';
    
    if (phState.phase === 'setup') {
        controlsHtml = `
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="preparePhEnvironments()" style="background: #e74c3c; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4); transition: 0.2s;">
                    <i class="fas fa-flask"></i> Prepare pH Environments
                </button>
            </div>
        `;
    } else if (phState.phase === 'ready') {
        controlsHtml = `
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="dispenseH2O2_ph()" style="background: #38bdf8; color: #0f172a; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); transition: 0.2s;">
                    <i class="fas fa-eye-dropper"></i> Add H₂O₂ to all tubes
                </button>
            </div>
        `;
    } else if (phState.phase === 'reacted') {
        controlsHtml = `
            <div style="text-align: center; margin-top: 20px; color: #10b981;">
                <h3 style="font-family: 'Poppins'; margin: 0;"><i class="fas fa-check-circle"></i> Reaction Complete</h3>
                <p style="font-size: 0.9rem; margin-top: 5px; color: #94a3b8;">Observe the variations in effervescence and log your deductions.</p>
                <button onclick="initLab15_3Engine(document.getElementById('simulation-render-target'), document.getElementById('dynamic-data-table-container'))" style="margin-top: 10px; background: #475569; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-family: 'Poppins';"><i class="fas fa-undo"></i> Reset Apparatus</button>
            </div>
        `;
    }

    workspace.innerHTML = `
        <style>
            .ph-grid { display: flex; flex-wrap: wrap; gap: 40px; justify-content: center; padding: 30px; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); }
            .ph-chamber { flex: 1; min-width: 120px; max-width: 150px; height: 220px; border-radius: 12px; position: relative; display: flex; justify-content: center; align-items: flex-end; padding-bottom: 20px; border: 2px dashed #475569; }
            
            /* Visual Indicators for pH environment */
            .bg-acid { background: rgba(239, 68, 68, 0.05); border-color: #ef4444; }
            .bg-neutral { background: rgba(16, 185, 129, 0.05); border-color: #10b981; }
            .bg-base { background: rgba(56, 189, 248, 0.05); border-color: #38bdf8; }

            .ph-label { position: absolute; top: 10px; width: 100%; text-align: center; font-family: 'Poppins'; font-weight: bold; font-size: 0.9rem; z-index: 20; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
            
            .test-tube { width: 34px; height: 160px; border: 2px solid rgba(255,255,255,0.6); border-top: none; border-radius: 0 0 17px 17px; position: relative; background: rgba(255,255,255,0.1); overflow: hidden; z-index: 10; }
            .fluid { position: absolute; bottom: 0; width: 100%; transition: height 0.5s ease; border-radius: 0 0 15px 15px; }
            
            .enz-bubble { position: absolute; background: rgba(255, 255, 255, 0.9); border-radius: 50%; bottom: 0; animation: enzRise linear forwards; box-shadow: inset -1px -1px 2px rgba(0,0,0,0.4); }
            @keyframes enzRise { 0% { bottom: 0; transform: scale(0.5) translateX(0); opacity: 1; } 100% { bottom: 100%; transform: scale(1.2) translateX(calc(-5px + 10px * var(--rand))); opacity: 0; } }
            
            .froth { position: absolute; top: 0; left: 0; width: 100%; background: rgba(255,255,255,0.85); border-radius: 5px; transition: height 1s ease; }
        </style>

        <div class="ph-grid">
            <!-- TUBE A: ACIDIC -->
            <div class="ph-chamber ${phState.phase !== 'setup' ? 'bg-acid' : ''}">
                <div class="ph-label" style="color: #ef4444;">TUBE A<br><span style="font-size:0.75rem; color:#cbd5e1;">${phState.phase !== 'setup' ? '+ HCl (Acidic)' : 'Waiting...'}</span></div>
                <div class="test-tube" id="tube-ph-a">
                    <div class="fluid" style="height: ${phState.phase === 'reacted' ? '50%' : '40%'}; background-color: rgba(180, 83, 9, 0.6);">
                        <div class="froth" id="froth-ph-a" style="height: 0;"></div>
                    </div>
                </div>
            </div>

            <!-- TUBE B: NEUTRAL -->
            <div class="ph-chamber ${phState.phase !== 'setup' ? 'bg-neutral' : ''}">
                <div class="ph-label" style="color: #10b981;">TUBE B<br><span style="font-size:0.75rem; color:#cbd5e1;">${phState.phase !== 'setup' ? '+ Water (Neutral)' : 'Waiting...'}</span></div>
                <div class="test-tube" id="tube-ph-b">
                    <div class="fluid" style="height: ${phState.phase === 'reacted' ? '50%' : '40%'}; background-color: rgba(180, 83, 9, 0.6);">
                        <div class="froth" id="froth-ph-b" style="height: 0;"></div>
                    </div>
                </div>
            </div>

            <!-- TUBE C: ALKALINE -->
            <div class="ph-chamber ${phState.phase !== 'setup' ? 'bg-base' : ''}">
                <div class="ph-label" style="color: #38bdf8;">TUBE C<br><span style="font-size:0.75rem; color:#cbd5e1;">${phState.phase !== 'setup' ? '+ NaOH (Alkaline)' : 'Waiting...'}</span></div>
                <div class="test-tube" id="tube-ph-c">
                    <div class="fluid" style="height: ${phState.phase === 'reacted' ? '50%' : '40%'}; background-color: rgba(180, 83, 9, 0.6);">
                        <div class="froth" id="froth-ph-c" style="height: 0;"></div>
                    </div>
                </div>
            </div>
        </div>

        ${controlsHtml}
    `;
}

function preparePhEnvironments() {
    phState.phase = 'ready';
    renderLab15_3Canvas(document.getElementById('simulation-render-target'));
}

function dispenseH2O2_ph() {
    phState.phase = 'reacted';
    renderLab15_3Canvas(document.getElementById('simulation-render-target'));

    // Trigger Enzyme Kinetics Animations based on pH!
    // A (Acid) = Denatured (Dead)
    // B (Neutral) = Optimum (Wild frothing)
    // C (Alkaline) = Denatured (Dead)

    triggerEffervescence('tube-ph-b', 'froth-ph-b', 30, 45);  // Vigorous frothing in Neutral tube
}

function renderLab15_3Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">a. How does pH affect the ability of enzymes to catalyse chemical reactions?</label>
                <textarea class="sim-input" id="rep_ph_theory" rows="2" placeholder="Explain effects on the active site..."></textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">b. Propose a possible hypothesis related to the effect of pH on enzyme activity:</label>
                <input type="text" class="sim-input" id="rep_ph_hyp" placeholder="e.g. Enzymes have an optimum pH...">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">c. Identify the variables involved:</label>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <input type="text" class="sim-input" id="rep_ph_iv" placeholder="i. Independent Variable">
                    <input type="text" class="sim-input" id="rep_ph_dv" placeholder="ii. Dependent Variable">
                    <input type="text" class="sim-input" id="rep_ph_cv" placeholder="iii. Two Controlled Variables">
                </div>
            </div>

            <h4 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 10px;">e. Record your observations:</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead><tr><th style="width: 50%;">Catalase incubated in varying pH</th><th style="width: 50%;">Degree of fizzing after addition of H₂O₂</th></tr></thead>
                    <tbody>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube A:</strong> (Acidic pH + Liver)</td><td><input type="text" class="sim-input" id="obs_ph_a" placeholder="..."></td></tr>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube B:</strong> (Neutral pH + Liver)</td><td><input type="text" class="sim-input" id="obs_ph_b" placeholder="..."></td></tr>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube C:</strong> (Alkaline pH + Liver)</td><td><input type="text" class="sim-input" id="obs_ph_c" placeholder="..."></td></tr>
                    </tbody>
                </table>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">f. Interpret your results obtained above as fully as you can:</label>
                <textarea class="sim-input" id="rep_ph_inf" rows="3" placeholder="Why did the tubes react differently?"></textarea>
            </div>
            
            <div style="margin-bottom: 10px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">g. Does your result confirm or refute the hypothesis?</label>
                <input type="text" class="sim-input" id="rep_ph_conf" placeholder="Yes/No, because...">
            </div>
        </div>
    `;
}

/* ==========================================================================
   LAB 15.4: ENZYME & SUBSTRATE CONCENTRATION (POTATO CATALASE ENGINE)
   ========================================================================== */

let concState = {
    phase: 'prep', // 'prep' -> 'ready' -> 'reacted'
    isExtracting: false,
    intervals: []
};

function initLab15_4Engine(workspace, tableContainer) {
    concState = { phase: 'prep', isExtracting: false, intervals: [] };
    renderLab15_4Canvas(workspace);
    renderLab15_4Table(tableContainer);
    showLab15_4Intro();
}

function showLab15_4Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #f59e0b; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(245, 158, 11, 0.2); color: #fff;">
                <h2 style="color: #f59e0b; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-chart-line"></i> Concentration Variables Setup</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>This experiment uses a <strong>Potato Tuber</strong> as the source of Catalase.</li>
                        <li><strong>Step 1:</strong> Homogenize the potato tissue to extract the enzyme.</li>
                        <li><strong>Step 2:</strong> The system will automatically prepare Tubes A, B, C, and D with the exact enzyme volumes specified in your manual (3ml, 2ml, 1ml, and 0ml respectively).</li>
                        <li><strong>Step 3:</strong> Inject the substrate (H₂O₂) and observe the differences in reaction rates based on collision theory.</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #f59e0b; color: #0f172a; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Acknowledge & Begin</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}
function renderLab15_4Canvas(workspace) {
    let uiHtml = '';
    
    const styleBlock = `
        <style>
            .incubator-grid { display: flex; flex-wrap: wrap; gap: 40px; justify-content: center; padding: 30px; border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); }
            .c-tube { width: 44px; height: 180px; border: 2px solid rgba(255,255,255,0.6); border-top: none; border-radius: 0 0 22px 22px; position: relative; background: rgba(255,255,255,0.05); overflow: hidden; box-shadow: inset -5px -5px 15px rgba(0,0,0,0.5); margin: 0 auto; z-index: 10; }
            .c-fluid { position: absolute; bottom: 0; width: 100%; transition: height 0.5s ease; border-radius: 0 0 20px 20px; }
            
            /* Foam/Froth Layer */
            .froth-layer { position: absolute; top: 0; left: 0; width: 100%; background: rgba(255,255,255,0.95); border-radius: 5px; transition: height 2s ease-out; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2); }
            
            /* Dynamic Bubble Generator */
            .enz-bubble { position: absolute; background: rgba(255, 255, 255, 0.9); border-radius: 50%; bottom: 0; animation: enzRise linear forwards; box-shadow: inset -1px -1px 2px rgba(0,0,0,0.4); }
            @keyframes enzRise { 
                0% { bottom: 0; transform: scale(0.5) translateX(0); opacity: 1; } 
                100% { bottom: 100%; transform: scale(1.5) translateX(calc(-8px + 16px * var(--rand))); opacity: 0; } 
            }
        </style>
    `;
    
    if (concState.phase === 'prep') {
        uiHtml = styleBlock + `
            <div style="text-align: center; width: 100%;">
                <h3 style="color: #f59e0b; font-family: 'Poppins'; margin-bottom: 20px;"><i class="fas fa-mortar-pestle"></i> Potato Homogenization</h3>
                <div style="background: #0f172a; padding: 30px; border-radius: 16px; border: 1px dashed #334155; display: inline-block;">
                    <i class="fas ${concState.isExtracting ? 'fa-cog fa-spin' : 'fa-leaf'} fa-4x" style="color: ${concState.isExtracting ? '#f59e0b' : '#10b981'}; margin-bottom: 20px;"></i>
                    <p style="color: #cbd5e1; margin-bottom: 20px;">${concState.isExtracting ? 'Grinding potato tuber & filtering extract...' : 'Fresh Potato Tuber ready for extraction.'}</p>
                    <button onclick="runPotatoExtraction()" style="background: #f59e0b; color: #0f172a; border: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; transition: 0.2s;">
                        <i class="fas fa-play"></i> Grind & Filter
                    </button>
                </div>
            </div>
        `;
    } else {
        uiHtml = styleBlock + `
            <div style="width: 100%;">
                <div class="incubator-grid" style="background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);">
                    
                    <div style="text-align: center; flex: 1; min-width: 80px;">
                        <div class="c-tube" id="tube-conc-a">
                            <!-- Added IDs for the fluid so bubbles can attach properly -->
                            <div class="c-fluid" id="fluid-conc-a" style="height: ${concState.phase === 'reacted' ? '65%' : '45%'}; background-color: rgba(245, 222, 179, 0.7);">
                                <div class="froth-layer" id="froth-conc-a" style="height: 0;"></div>
                            </div>
                        </div>
                        <h3 style="color:#f59e0b; margin: 10px 0 2px; font-family:'Poppins';">TUBE A</h3>
                        <span style="color:#cbd5e1; font-size:0.7rem;">3ml Extract</span>
                    </div>

                    <div style="text-align: center; flex: 1; min-width: 80px;">
                        <div class="c-tube" id="tube-conc-b">
                            <div class="c-fluid" id="fluid-conc-b" style="height: ${concState.phase === 'reacted' ? '50%' : '30%'}; background-color: rgba(245, 222, 179, 0.7);">
                                <div class="froth-layer" id="froth-conc-b" style="height: 0;"></div>
                            </div>
                        </div>
                        <h3 style="color:#38bdf8; margin: 10px 0 2px; font-family:'Poppins';">TUBE B</h3>
                        <span style="color:#cbd5e1; font-size:0.7rem;">2ml Extract</span>
                    </div>

                    <div style="text-align: center; flex: 1; min-width: 80px;">
                        <div class="c-tube" id="tube-conc-c">
                            <div class="c-fluid" id="fluid-conc-c" style="height: ${concState.phase === 'reacted' ? '40%' : '15%'}; background-color: rgba(245, 222, 179, 0.7);">
                                <div class="froth-layer" id="froth-conc-c" style="height: 0;"></div>
                            </div>
                        </div>
                        <h3 style="color:#10b981; margin: 10px 0 2px; font-family:'Poppins';">TUBE C</h3>
                        <span style="color:#cbd5e1; font-size:0.7rem;">1ml Extract</span>
                    </div>

                    <div style="text-align: center; flex: 1; min-width: 80px;">
                        <div class="c-tube" id="tube-conc-d">
                            <div class="c-fluid" id="fluid-conc-d" style="height: ${concState.phase === 'reacted' ? '30%' : '5%'}; background-color: rgba(255, 255, 255, 0.2);">
                                <div class="froth-layer" id="froth-conc-d" style="height: 0;"></div>
                            </div>
                        </div>
                        <h3 style="color:#ef4444; margin: 10px 0 2px; font-family:'Poppins';">TUBE D</h3>
                        <span style="color:#cbd5e1; font-size:0.7rem;">0ml (Control)</span>
                    </div>

                </div>

                <div style="text-align: center; margin-top: 20px;">
                    ${concState.phase === 'ready' ? `
                        <button onclick="dispenseH2O2_Conc()" style="background: #38bdf8; color: #0f172a; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); transition: 0.2s;">
                            <i class="fas fa-syringe"></i> Inject H₂O₂ Substrate
                        </button>
                    ` : `
                        <h3 style="color: #10b981; font-family: 'Poppins'; margin: 0;"><i class="fas fa-check-circle"></i> Reaction Complete</h3>
                        <button onclick="initLab15_4Engine(document.getElementById('simulation-render-target'), document.getElementById('dynamic-data-table-container'))" style="margin-top: 10px; background: #475569; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-family: 'Poppins';"><i class="fas fa-undo"></i> Reset Apparatus</button>
                    `}
                </div>
            </div>
        `;
    }

    workspace.innerHTML = uiHtml;
}

function runPotatoExtraction() {
    concState.isExtracting = true;
    renderLab15_4Canvas(document.getElementById('simulation-render-target'));
    setTimeout(() => {
        concState.phase = 'ready';
        renderLab15_4Canvas(document.getElementById('simulation-render-target'));
    }, 2000);
}

function dispenseH2O2_Conc() {
    concState.phase = 'reacted';
    renderLab15_4Canvas(document.getElementById('simulation-render-target'));

    // Delay slightly to let the CSS height transition start, then spawn bubbles
    setTimeout(() => {
        // Tube A: 3ml enzyme -> 1 bubble every 15ms (Violent!), 50px of white froth
        triggerEffervescence_Conc('fluid-conc-a', 'froth-conc-a', 15, 50); 
        
        // Tube B: 2ml enzyme -> 1 bubble every 40ms, 30px of white froth
        triggerEffervescence_Conc('fluid-conc-b', 'froth-conc-b', 40, 30); 
        
        // Tube C: 1ml enzyme -> 1 bubble every 120ms (Slow), 10px of white froth
        triggerEffervescence_Conc('fluid-conc-c', 'froth-conc-c', 120, 10); 
        
        // Tube D gets nothing (Control tube)
    }, 300);
}

// Dedicated Bubble Engine for Experiment 4
function triggerEffervescence_Conc(fluidId, frothId, speedMs, frothHeight) {
    const tubeFluid = document.getElementById(fluidId);
    const froth = document.getElementById(frothId);
    
    if (!tubeFluid || !froth) return;

    // Grow the white froth layer at the top of the fluid
    froth.style.height = frothHeight + 'px';

    // Generate physical bubbles rising through the liquid
    let interval = setInterval(() => {
        let bubble = document.createElement('div');
        bubble.classList.add('enz-bubble');
        
        let size = Math.random() * 6 + 2; // Random bubble size
        let leftPos = Math.random() * 80 + 10; // Random horizontal position
        let duration = Math.random() * 0.4 + 0.4; // Random rising speed
        
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = leftPos + '%';
        bubble.style.animationDuration = duration + 's';
        bubble.style.setProperty('--rand', Math.random()); // Gives each bubble a random zigzag

        tubeFluid.appendChild(bubble);

        // Clean up the bubble from the DOM once it reaches the top to save memory
        setTimeout(() => {
            if(tubeFluid.contains(bubble)) bubble.remove();
        }, duration * 1000);

    }, speedMs);

    concState.intervals.push(interval);
    
    // Stop the reaction bubbling after 6 seconds to simulate the substrate (H2O2) running out
    setTimeout(() => {
        clearInterval(interval);
    }, 6000);
}

function renderLab15_4Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">a. Propose two hypotheses for this experiment:</label>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <input type="text" class="sim-input" id="rep_hyp_sub" placeholder="i. Related to Substrate Concentration...">
                    <input type="text" class="sim-input" id="rep_hyp_enz" placeholder="ii. Related to Enzyme Concentration...">
                </div>
            </div>

            <h4 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 10px;">b. Record your results:</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead>
                        <tr>
                            <th style="width: 20%;">Test Tube</th>
                            <th style="width: 20%;">Potato Juice (ml)</th>
                            <th style="width: 20%;">H₂O₂ (ml)</th>
                            <th style="width: 40%;">Degree of Fizzing (Observation)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>A</td><td>3 ml</td><td>1 ml</td><td><input type="text" class="sim-input" id="obs_conc_a" placeholder="..."></td></tr>
                        <tr><td>B</td><td>2 ml</td><td>1 ml</td><td><input type="text" class="sim-input" id="obs_conc_b" placeholder="..."></td></tr>
                        <tr><td>C</td><td>1 ml</td><td>2 ml</td><td><input type="text" class="sim-input" id="obs_conc_c" placeholder="..."></td></tr>
                        <tr><td>D</td><td>0 ml</td><td>2 ml</td><td><input type="text" class="sim-input" id="obs_conc_d" placeholder="..."></td></tr>
                    </tbody>
                </table>
            </div>

            <h4 style="color: #94a3b8; font-family: 'Poppins'; margin-bottom: 10px;">c. Interpret your results:</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                <input type="text" class="sim-input" id="inf_conc_a" placeholder="Test tube A...">
                <input type="text" class="sim-input" id="inf_conc_b" placeholder="Test tube B...">
                <input type="text" class="sim-input" id="inf_conc_c" placeholder="Test tube C...">
                <input type="text" class="sim-input" id="inf_conc_d" placeholder="Test tube D...">
            </div>

            <h4 style="color: #38bdf8; font-family: 'Poppins'; margin-bottom: 10px;">d & e. Comparisons & Conclusions:</h4>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <textarea class="sim-input" id="comp_ab" rows="2" placeholder="d. i. Compare A and B..."></textarea>
                <textarea class="sim-input" id="concl_enz" rows="2" placeholder="d. ii. What can you conclude on the effect of enzyme concentration?"></textarea>
                <textarea class="sim-input" id="comp_cd" rows="2" placeholder="e. i. Compare C and D..."></textarea>
                <textarea class="sim-input" id="role_d" rows="2" placeholder="e. iii. How does result D enable you to interpret C? (What is D's role?)"></textarea>
            </div>
        </div>
    `;
}

/* ==========================================================================
   LAB 15.5: SUBSTRATE CONCENTRATION (QUANTITATIVE FOAM ENGINE)
   ========================================================================== */

let subState = {
    phase: 'setup', // 'setup' -> 'reacted'
    intervals: []
};

function initLab15_5Engine(workspace, tableContainer) {
    subState = { phase: 'setup', intervals: [] };
    renderLab15_5Canvas(workspace);
    renderLab15_5Table(tableContainer);
}

function renderLab15_5Canvas(workspace) {
    const styleBlock = `
        <style>
            .sub-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 30px; border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); }
            
            /* The tube container includes a visual ruler background */
            .measuring-tube { width: 50px; height: 200px; border: 2px solid rgba(255,255,255,0.6); border-top: none; border-radius: 0 0 25px 25px; position: relative; background: rgba(255,255,255,0.05); overflow: hidden; box-shadow: inset -5px -5px 15px rgba(0,0,0,0.5); margin: 0 auto; z-index: 10; 
                background-image: repeating-linear-gradient(to bottom, transparent, transparent 18px, rgba(255,255,255,0.3) 19px, rgba(255,255,255,0.3) 20px);
            }
            
            .c-fluid { position: absolute; bottom: 0; width: 100%; transition: height 0.5s ease; border-radius: 0 0 23px 23px; }
            
            /* FIX: Changed top: 0 to bottom: 100% so the froth stacks ON TOP of the fluid */
            .froth-layer { position: absolute; bottom: 100%; left: 0; width: 100%; background: rgba(255,255,255,0.95); border-radius: 5px; transition: height 3s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: inset 0 2px 5px rgba(0,0,0,0.2); }
            
            .enz-bubble { position: absolute; background: rgba(255, 255, 255, 0.9); border-radius: 50%; bottom: 0; animation: enzRise linear forwards; box-shadow: inset -1px -1px 2px rgba(0,0,0,0.4); }
            @keyframes enzRise { 
                0% { bottom: 0; transform: scale(0.5) translateX(0); opacity: 1; } 
                100% { bottom: 100%; transform: scale(1.5) translateX(calc(-8px + 16px * var(--rand))); opacity: 0; } 
            }

            .ruler-ticks { position: absolute; height: 200px; width: 20px; left: -25px; top: 0; color: #94a3b8; font-family: monospace; font-size: 0.65rem; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; padding-bottom: 25px; box-sizing: border-box; }
            .tube-wrapper { position: relative; display: inline-block; }
        </style>
    `;

    // Heights logic: Base fluid is 30% (60px). Ruler is 20px per cm.
    // 100% foam = 120px (6cm). 75% = 90px (4.5cm). 50% = 60px (3cm). 25% = 30px (1.5cm). 0% = 0px (0cm).
    let uiHtml = styleBlock + `
        <div style="width: 100%;">
            <div class="sub-grid">
                
                ${[
                    { id: '100', name: '100%', color: '#38bdf8' },
                    { id: '75', name: '75%', color: '#10b981' },
                    { id: '50', name: '50%', color: '#facc15' },
                    { id: '25', name: '25%', color: '#f59e0b' },
                    { id: '0', name: '0%', color: '#ef4444' }
                ].map(tube => `
                    <div style="text-align: center; flex: 1; min-width: 70px;">
                        <div class="tube-wrapper">
                            ${tube.id === '100' ? `
                                <div class="ruler-ticks">
                                    <span>8-</span><span>7-</span><span>6-</span><span>5-</span><span>4-</span><span>3-</span><span>2-</span><span>1-</span><span>0-</span>
                                </div>
                            ` : ''}
                            <div class="measuring-tube" id="tube-sub-${tube.id}">
                                <div class="c-fluid" id="fluid-sub-${tube.id}" style="height: ${subState.phase === 'reacted' ? '30%' : '15%'}; background-color: rgba(56, 189, 248, 0.2);">
                                    <div class="froth-layer" id="froth-sub-${tube.id}" style="height: 0;"></div>
                                </div>
                            </div>
                        </div>
                        <h3 style="color:${tube.color}; margin: 10px 0 2px; font-family:'Poppins';">${tube.name}</h3>
                        <span style="color:#cbd5e1; font-size:0.7rem;">H₂O₂</span>
                    </div>
                `).join('')}

            </div>

            <div style="text-align: center; margin-top: 20px;">
                ${subState.phase === 'setup' ? `
                    <button onclick="dispenseCatalase()" style="background: #e74c3c; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4); transition: 0.2s;">
                        <i class="fas fa-vial"></i> Add 2ml Catalase to all tubes
                    </button>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 10px;"><i class="fas fa-info-circle"></i> Tubes currently contain 2ml of their respective H₂O₂ dilutions.</p>
                ` : `
                    <h3 style="color: #10b981; font-family: 'Poppins'; margin: 0;"><i class="fas fa-ruler"></i> Measurement Phase</h3>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 5px;">Count the scale lines behind the foam. 1 line = 1 cm.</p>
                    <button onclick="initLab15_5Engine(document.getElementById('simulation-render-target'), document.getElementById('dynamic-data-table-container'))" style="margin-top: 10px; background: #475569; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-family: 'Poppins';"><i class="fas fa-undo"></i> Reset Apparatus</button>
                `}
            </div>
        </div>
    `;

    workspace.innerHTML = uiHtml;
}

function dispenseCatalase() {
    subState.phase = 'reacted';
    renderLab15_5Canvas(document.getElementById('simulation-render-target'));

    // The fluid changes from clear H2O2 to slightly brown (Liver extract added)
    const fluids = document.querySelectorAll('.c-fluid');
    fluids.forEach(f => f.style.backgroundColor = 'rgba(180, 83, 9, 0.5)');

    setTimeout(() => {
        // Tube 100%: 6.0 cm foam (120px)
        triggerEffervescence_Sub('fluid-sub-100', 'froth-sub-100', 15, 120); 
        
        // Tube 75%: 4.5 cm foam (90px)
        triggerEffervescence_Sub('fluid-sub-75', 'froth-sub-75', 25, 90); 
        
        // Tube 50%: 3.0 cm foam (60px)
        triggerEffervescence_Sub('fluid-sub-50', 'froth-sub-50', 45, 60); 
        
        // Tube 25%: 1.5 cm foam (30px)
        triggerEffervescence_Sub('fluid-sub-25', 'froth-sub-25', 90, 30); 
        
        // Tube 0% gets nothing (Water only control)
    }, 500);
}

// Dedicated Bubble Engine for Quantitative Measurement
function triggerEffervescence_Sub(fluidId, frothId, speedMs, frothHeight) {
    const tubeFluid = document.getElementById(fluidId);
    const froth = document.getElementById(frothId);
    
    if (!tubeFluid || !froth) return;

    // Grow the white froth layer UPWARDS (using pixel height)
    froth.style.height = frothHeight + 'px';

    // Generate physical bubbles
    let interval = setInterval(() => {
        let bubble = document.createElement('div');
        bubble.classList.add('enz-bubble');
        
        let size = Math.random() * 6 + 2; 
        let leftPos = Math.random() * 80 + 10; 
        let duration = Math.random() * 0.5 + 0.3; 
        
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = leftPos + '%';
        bubble.style.animationDuration = duration + 's';
        bubble.style.setProperty('--rand', Math.random()); 

        tubeFluid.appendChild(bubble);

        setTimeout(() => {
            if(tubeFluid.contains(bubble)) bubble.remove();
        }, duration * 1000);

    }, speedMs);

    subState.intervals.push(interval);
    
    // Stop bubbling after 8 seconds 
    setTimeout(() => {
        clearInterval(interval);
    }, 8000);
}

function renderLab15_5Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">a. Propose a possible hypothesis:</label>
                <input type="text" class="sim-input" id="rep_sub_hyp" placeholder="As substrate concentration increases...">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">b. Identify the variables involved:</label>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <input type="text" class="sim-input" id="rep_sub_iv" placeholder="i. Independent Variable (altered factor)">
                    <input type="text" class="sim-input" id="rep_sub_dv" placeholder="ii. Dependent Variable (measured factor)">
                    <input type="text" class="sim-input" id="rep_sub_cv" placeholder="iii. Two Controlled Variables (kept constant)">
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">c. Describe the procedure and precaution to test your hypothesis:</label>
                <textarea class="sim-input" id="rep_sub_proc" rows="2" placeholder="Detail the steps and safety measures..."></textarea>
            </div>

            <h4 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 10px;">d. Record the observations and results:</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead>
                        <tr>
                            <th style="width: 25%; text-align: left;">Substrate concentration</th>
                            <th>100%</th>
                            <th>75%</th>
                            <th>50%</th>
                            <th>25%</th>
                            <th>0%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="color:#cbd5e1; text-align:left; font-weight: bold;">Degree of fizzing</td>
                            <td><input type="text" class="sim-input" id="fizz_100" placeholder="e.g. Vigorous"></td>
                            <td><input type="text" class="sim-input" id="fizz_75" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="fizz_50" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="fizz_25" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="fizz_0" placeholder="..."></td>
                        </tr>
                        <tr>
                            <td style="color:#cbd5e1; text-align:left; font-weight: bold;">Length of foaming in cm</td>
                            <td><input type="number" step="0.1" class="sim-input" id="foam_100" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="foam_75" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="foam_50" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="foam_25" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="foam_0" placeholder="cm"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">e. Interpret the results obtained in d) above as fully as you can:</label>
                <textarea class="sim-input" id="rep_sub_inf" rows="3" placeholder="Explain the relationship between concentration, collisions, and foam height..."></textarea>
            </div>
            
            <div style="margin-bottom: 10px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">f. Does the result confirm or refute the hypothesis?</label>
                <input type="text" class="sim-input" id="rep_sub_conf" placeholder="Yes/No, because...">
            </div>
            
            <p style="color: #ef4444; font-size: 0.8rem; margin-top: 15px;"><i class="fas fa-exclamation-triangle"></i> Note: The requirement to plot a bar graph (Part g) is omitted in this digital laboratory.</p>
        </div>
    `;
}

/* ==========================================================================
   LAB 15.6: CATALASE TISSUE DISTRIBUTION (GERMINATING BEAN SEED)
   ========================================================================== */

let distState = {
    phase: 'prep', // 'prep' -> 'ready' -> 'reacted'
    isExtracting: false,
    intervals: []
};

function initLab15_6Engine(workspace, tableContainer) {
    distState = { phase: 'prep', isExtracting: false, intervals: [] };
    renderLab15_6Canvas(workspace);
    renderLab15_6Table(tableContainer);
    showLab15_6Intro();
}

function showLab15_6Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #10b981; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(16, 185, 129, 0.2); color: #fff;">
                <h2 style="color: #10b981; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-leaf"></i> Seed Anatomy & Catalase Setup</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>To find out where enzymes are located, you must dissect the germinating bean seeds into their four distinct anatomical parts: <strong>Testa, Cotyledon, Plumule, and Radicle</strong>.</li>
                        <li><strong>Step 1:</strong> The system will simulate the dissection, crushing, and extraction of these specific tissues.</li>
                        <li><strong>Step 2:</strong> Test each extract with H₂O₂.</li>
                        <li><strong>Hint:</strong> Think about what each part of the seed does. Which part is dead? Which part is actively dividing and growing?</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #10b981; color: #0f172a; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Acknowledge & Dissect</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab15_6Canvas(workspace) {
    let uiHtml = '';
    
    const styleBlock = `
        <style>
            .dist-grid { display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; padding: 30px; border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); }
            
            .measuring-tube { width: 50px; height: 200px; border: 2px solid rgba(255,255,255,0.6); border-top: none; border-radius: 0 0 25px 25px; position: relative; background: rgba(255,255,255,0.05); overflow: hidden; box-shadow: inset -5px -5px 15px rgba(0,0,0,0.5); margin: 0 auto; z-index: 10; 
                background-image: repeating-linear-gradient(to bottom, transparent, transparent 18px, rgba(255,255,255,0.3) 19px, rgba(255,255,255,0.3) 20px);
            }
            
            .c-fluid { position: absolute; bottom: 0; width: 100%; transition: height 0.5s ease; border-radius: 0 0 23px 23px; }
            .froth-layer { position: absolute; bottom: 100%; left: 0; width: 100%; background: rgba(255,255,255,0.95); border-radius: 5px; transition: height 3s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: inset 0 2px 5px rgba(0,0,0,0.2); }
            
            .enz-bubble { position: absolute; background: rgba(255, 255, 255, 0.9); border-radius: 50%; bottom: 0; animation: enzRise linear forwards; box-shadow: inset -1px -1px 2px rgba(0,0,0,0.4); }
            @keyframes enzRise { 
                0% { bottom: 0; transform: scale(0.5) translateX(0); opacity: 1; } 
                100% { bottom: 100%; transform: scale(1.5) translateX(calc(-8px + 16px * var(--rand))); opacity: 0; } 
            }

            .ruler-ticks { position: absolute; height: 200px; width: 20px; left: -25px; top: 0; color: #94a3b8; font-family: monospace; font-size: 0.65rem; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; padding-bottom: 25px; box-sizing: border-box; }
            .tube-wrapper { position: relative; display: inline-block; }
        </style>
    `;
    
    if (distState.phase === 'prep') {
        uiHtml = styleBlock + `
            <div style="text-align: center; width: 100%;">
                <h3 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 20px;"><i class="fas fa-microscope"></i> Seed Dissection & Extraction</h3>
                <div style="background: #0f172a; padding: 30px; border-radius: 16px; border: 1px dashed #334155; display: inline-block;">
                    <i class="fas ${distState.isExtracting ? 'fa-cog fa-spin' : 'fa-cut'} fa-4x" style="color: ${distState.isExtracting ? '#10b981' : '#38bdf8'}; margin-bottom: 20px;"></i>
                    <p style="color: #cbd5e1; margin-bottom: 20px;">${distState.isExtracting ? 'Separating and crushing tissues...' : '10 Germinating bean seeds ready for dissection.'}</p>
                    <button onclick="runSeedExtraction()" style="background: #10b981; color: #0f172a; border: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; transition: 0.2s;">
                        <i class="fas fa-play"></i> Dissect, Crush & Filter
                    </button>
                </div>
            </div>
        `;
    } else {
        uiHtml = styleBlock + `
            <div style="width: 100%;">
                <div class="dist-grid">
                    
                    ${[
                        { id: 'a', name: 'TUBE A', tissue: 'Testa', color: '#94a3b8', fluid: 'rgba(139, 69, 19, 0.4)' },
                        { id: 'b', name: 'TUBE B', tissue: 'Cotyledon', color: '#facc15', fluid: 'rgba(245, 245, 220, 0.8)' },
                        { id: 'c', name: 'TUBE C', tissue: 'Plumule', color: '#10b981', fluid: 'rgba(173, 255, 173, 0.6)' },
                        { id: 'd', name: 'TUBE D', tissue: 'Radicle', color: '#38bdf8', fluid: 'rgba(240, 255, 240, 0.6)' }
                    ].map((tube, index) => `
                        <div style="text-align: center; flex: 1; min-width: 80px;">
                            <div class="tube-wrapper">
                                ${index === 0 ? `
                                    <div class="ruler-ticks">
                                        <span>8-</span><span>7-</span><span>6-</span><span>5-</span><span>4-</span><span>3-</span><span>2-</span><span>1-</span><span>0-</span>
                                    </div>
                                ` : ''}
                                <div class="measuring-tube" id="tube-dist-${tube.id}">
                                    <div class="c-fluid" id="fluid-dist-${tube.id}" style="height: ${distState.phase === 'reacted' ? '30%' : '15%'}; background-color: ${tube.fluid};">
                                        <div class="froth-layer" id="froth-dist-${tube.id}" style="height: 0;"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 style="color:${tube.color}; margin: 10px 0 2px; font-family:'Poppins';">${tube.name}</h3>
                            <span style="color:#cbd5e1; font-size:0.75rem; font-weight:bold;">${tube.tissue}</span>
                        </div>
                    `).join('')}

                </div>

                <div style="text-align: center; margin-top: 20px;">
                    ${distState.phase === 'ready' ? `
                        <button onclick="dispenseH2O2_Dist()" style="background: #38bdf8; color: #0f172a; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); transition: 0.2s;">
                            <i class="fas fa-syringe"></i> Inject H₂O₂ to all tubes
                        </button>
                    ` : `
                        <h3 style="color: #10b981; font-family: 'Poppins'; margin: 0;"><i class="fas fa-ruler"></i> Measurement Phase</h3>
                        <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 5px;">Count the scale lines behind the foam to find the highest catalase concentration.</p>
                        <button onclick="initLab15_6Engine(document.getElementById('simulation-render-target'), document.getElementById('dynamic-data-table-container'))" style="margin-top: 10px; background: #475569; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-family: 'Poppins';"><i class="fas fa-undo"></i> Reset Apparatus</button>
                    `}
                </div>
            </div>
        `;
    }

    workspace.innerHTML = uiHtml;
}

function runSeedExtraction() {
    distState.isExtracting = true;
    renderLab15_6Canvas(document.getElementById('simulation-render-target'));
    setTimeout(() => {
        distState.phase = 'ready';
        renderLab15_6Canvas(document.getElementById('simulation-render-target'));
    }, 2000);
}

function dispenseH2O2_Dist() {
    distState.phase = 'reacted';
    renderLab15_6Canvas(document.getElementById('simulation-render-target'));

    setTimeout(() => {
        // Tube A (Testa): Dead tissue. Trace amounts of catalase. Foam ~0.2cm (4px)
        triggerEffervescence_Dist('fluid-dist-a', 'froth-dist-a', 900, 4); 
        
        // Tube B (Cotyledon): Storage. Moderate catalase. Foam ~2.5cm (50px)
        triggerEffervescence_Dist('fluid-dist-b', 'froth-dist-b', 50, 50); 
        
        // Tube C (Plumule): Actively growing shoot. High catalase. Foam ~4.5cm (90px)
        triggerEffervescence_Dist('fluid-dist-c', 'froth-dist-c', 25, 90); 
        
        // Tube D (Radicle): Actively growing root. Highest metabolism/catalase. Foam ~5.5cm (110px)
        triggerEffervescence_Dist('fluid-dist-d', 'froth-dist-d', 15, 110); 
    }, 300);
}

// Dedicated Bubble Engine for the Distribution Measurement
function triggerEffervescence_Dist(fluidId, frothId, speedMs, frothHeight) {
    const tubeFluid = document.getElementById(fluidId);
    const froth = document.getElementById(frothId);
    
    if (!tubeFluid || !froth) return;

    // Grow the white froth layer UPWARDS (using pixel height)
    froth.style.height = frothHeight + 'px';

    // Generate physical bubbles
    let interval = setInterval(() => {
        let bubble = document.createElement('div');
        bubble.classList.add('enz-bubble');
        
        let size = Math.random() * 6 + 2; 
        let leftPos = Math.random() * 80 + 10; 
        let duration = Math.random() * 0.5 + 0.3; 
        
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = leftPos + '%';
        bubble.style.animationDuration = duration + 's';
        bubble.style.setProperty('--rand', Math.random()); 

        tubeFluid.appendChild(bubble);

        setTimeout(() => {
            if(tubeFluid.contains(bubble)) bubble.remove();
        }, duration * 1000);

    }, speedMs);

    distState.intervals.push(interval);
    
    // Stop bubbling after 8 seconds 
    setTimeout(() => {
        clearInterval(interval);
    }, 8000);
}

function renderLab15_6Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">a. Propose a possible hypothesis for this experiment:</label>
                <input type="text" class="sim-input" id="rep_dist_hyp" placeholder="How is catalase distributed in a seed based on growth?">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">b. Identify the variables involved in this experiment:</label>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <input type="text" class="sim-input" id="rep_dist_iv" placeholder="i. Independent Variable (altered factor)">
                    <input type="text" class="sim-input" id="rep_dist_dv" placeholder="ii. Dependent Variable (measured factor)">
                    <input type="text" class="sim-input" id="rep_dist_cv" placeholder="iii. Two Controlled variables">
                </div>
            </div>

            <h4 style="color: #38bdf8; font-family: 'Poppins'; margin-bottom: 10px;">c. Record your observations and results:</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead>
                        <tr>
                            <th style="width: 30%; text-align: left;">Part of Germinating Seed</th>
                            <th style="width: 40%;">Qualitative degree of fizzing<br><span style="font-size: 0.7rem; font-weight:normal;">(No fizz, Slight, Moderate, Vigorous)</span></th>
                            <th style="width: 30%;">Quantitative measurement<br><span style="font-size: 0.7rem; font-weight:normal;">(Height of foam in cm)</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube A</strong> (Testa)</td><td><input type="text" class="sim-input" id="fizz_dist_a" placeholder="..."></td><td><input type="number" step="0.1" class="sim-input" id="foam_dist_a" placeholder="cm"></td></tr>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube B</strong> (Cotyledon)</td><td><input type="text" class="sim-input" id="fizz_dist_b" placeholder="..."></td><td><input type="number" step="0.1" class="sim-input" id="foam_dist_b" placeholder="cm"></td></tr>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube C</strong> (Plumule)</td><td><input type="text" class="sim-input" id="fizz_dist_c" placeholder="..."></td><td><input type="number" step="0.1" class="sim-input" id="foam_dist_c" placeholder="cm"></td></tr>
                        <tr><td style="color:#cbd5e1; text-align:left;"><strong>Test tube D</strong> (Radicle)</td><td><input type="text" class="sim-input" id="fizz_dist_d" placeholder="..."></td><td><input type="number" step="0.1" class="sim-input" id="foam_dist_d" placeholder="cm"></td></tr>
                    </tbody>
                </table>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">d. Interpret the results obtained in c) above as fully as you can:</label>
                <textarea class="sim-input" id="rep_dist_inf" rows="4" placeholder="Explain the biological role of each seed part and why its catalase concentration differs..."></textarea>
            </div>
            
            <div style="margin-bottom: 10px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">e. Does the result confirm or refute the hypothesis?</label>
                <input type="text" class="sim-input" id="rep_dist_conf" placeholder="Yes/No, because...">
            </div>
        </div>
    `;
}

/* ==========================================================================
   LAB 13.1: OSMOSIS IN CARROT STRIPS (MACRO-RULER ENGINE)
   ========================================================================== */

let osmoState = {
    phase: 'setup', // 'setup', 'incubating', 'ready'
    timer: 45,      // 45 simulated minutes
    animId: null
};

function initLab13_1Engine(workspace, tableContainer) {
    osmoState = { phase: 'setup', timer: 45 };
    renderLab13_1Canvas(workspace);
    renderLab13_1Table(tableContainer);
    showLab13_1Intro();
}

function showLab13_1Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #3b82f6; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(59, 130, 246, 0.2); color: #fff;">
                <h2 style="color: #3b82f6; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-carrot"></i> Osmosis Physiology Setup</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol & Assumptions:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>The system has perfectly cut four carrot strips to exactly <strong>5.0 cm length</strong>, 1.0 cm width, and 1.0 cm height.</li>
                        <li>Their initial texture is <strong>Firm / Rigid</strong>.</li>
                        <li><strong>Step 1:</strong> You will submerge the strips in four different environments (Distilled Water, 0.5M NaCl, 1M NaCl, and 1M NaOH).</li>
                        <li><strong>Step 2:</strong> After a 45-minute incubation, the system will apply digital rulers so you can measure the new lengths and visually inspect the textural degradation.</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #3b82f6; color: #fff; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Acknowledge & Begin</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab13_1Canvas(workspace) {
    let uiHtml = '';
    
    // CSS for the Petri dishes and carrots
    const styleBlock = `
        <style>
            .osmo-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 25px; border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); }
            .petri-dish { width: 180px; height: 180px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.3); position: relative; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3); }
            
            /* Fluid colors */
            .fluid-dw { background: rgba(56, 189, 248, 0.15); }
            .fluid-nacl1 { background: rgba(255, 255, 255, 0.1); }
            .fluid-nacl2 { background: rgba(255, 255, 255, 0.15); }
            .fluid-naoh { background: rgba(245, 158, 11, 0.05); }

            /* Carrot Strip Base */
            .carrot-strip { background: #d97706; border-radius: 2px; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); transition: all 2s ease-in-out; position: relative; }
            
            /* Textural States */
            .turgid { background: #f59e0b; box-shadow: 3px 3px 8px rgba(0,0,0,0.6); border: 1px solid #fbbf24; }
            .flaccid { background: #b45309; opacity: 0.9; }
            .plasmolyzed { background: #92400e; border-radius: 6px; transform: scaleY(0.95); opacity: 0.8; border: 1px dashed #78350f; }
            .mushy { background: #a16207; filter: blur(1.5px); opacity: 0.7; border-radius: 8px; transform: scaleY(0.9); }

            .dish-label { position: absolute; bottom: -30px; text-align: center; width: 100%; font-family: 'Poppins'; font-weight: bold; font-size: 0.85rem; color: #cbd5e1; }
            
            /* Digital Ruler overlay */
            .macro-ruler { position: absolute; top: 15px; left: 15px; width: 150px; height: 20px; border-bottom: 2px solid #10b981; display: flex; justify-content: space-between; align-items: flex-end; opacity: 0; transition: opacity 1s ease; }
            .tick { width: 2px; background: #10b981; }
            .tick-major { height: 10px; }
            .tick-minor { height: 5px; }
            .ruler-text { position: absolute; top: -15px; left: 0; color: #10b981; font-size: 0.65rem; font-family: monospace; font-weight: bold; }
        </style>
    `;

    // Calculate Physical Pixel Widths
    // Base: 5.0 cm = 150px (30px per cm)
    let w_base = 150; 
    let w_dw = (osmoState.phase === 'ready' || osmoState.phase === 'measured') ? 159 : w_base;    // 5.3 cm
    let w_nacl1 = (osmoState.phase === 'ready' || osmoState.phase === 'measured') ? 138 : w_base; // 4.6 cm
    let w_nacl2 = (osmoState.phase === 'ready' || osmoState.phase === 'measured') ? 129 : w_base; // 4.3 cm
    let w_naoh = (osmoState.phase === 'ready' || osmoState.phase === 'measured') ? 126 : w_base;  // 4.2 cm (Mushy)

    // Assign Textural CSS classes
    let class_dw = (osmoState.phase === 'ready' || osmoState.phase === 'measured') ? 'turgid' : '';
    let class_nacl1 = (osmoState.phase === 'ready' || osmoState.phase === 'measured') ? 'flaccid' : '';
    let class_nacl2 = (osmoState.phase === 'ready' || osmoState.phase === 'measured') ? 'plasmolyzed' : '';
    let class_naoh = (osmoState.phase === 'ready' || osmoState.phase === 'measured') ? 'mushy' : '';

    let rulerOpacity = (osmoState.phase === 'ready' || osmoState.phase === 'measured') ? '1' : '0';

    uiHtml = styleBlock + `
        <div style="width: 100%;">
            <div class="osmo-grid">
                
                <div class="petri-dish fluid-dw">
                    <div class="macro-ruler" style="opacity: ${rulerOpacity};">
                        <span class="ruler-text">0cm</span><span class="ruler-text" style="left:145px;">5cm</span>
                        <div class="tick tick-major"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-major"></div>
                    </div>
                    <div class="carrot-strip ${class_dw}" style="width: ${w_dw}px; height: 30px;"></div>
                    <div class="dish-label">Distilled Water</div>
                </div>

                <div class="petri-dish fluid-nacl1">
                    <div class="macro-ruler" style="opacity: ${rulerOpacity};">
                        <span class="ruler-text">0cm</span><span class="ruler-text" style="left:145px;">5cm</span>
                        <div class="tick tick-major"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-major"></div>
                    </div>
                    <div class="carrot-strip ${class_nacl1}" style="width: ${w_nacl1}px; height: 30px;"></div>
                    <div class="dish-label">0.5M NaCl</div>
                </div>

                <div class="petri-dish fluid-nacl2">
                    <div class="macro-ruler" style="opacity: ${rulerOpacity};">
                        <span class="ruler-text">0cm</span><span class="ruler-text" style="left:145px;">5cm</span>
                        <div class="tick tick-major"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-major"></div>
                    </div>
                    <div class="carrot-strip ${class_nacl2}" style="width: ${w_nacl2}px; height: 30px;"></div>
                    <div class="dish-label">1M NaCl</div>
                </div>

                <div class="petri-dish fluid-naoh">
                    <div class="macro-ruler" style="opacity: ${rulerOpacity};">
                        <span class="ruler-text">0cm</span><span class="ruler-text" style="left:145px;">5cm</span>
                        <div class="tick tick-major"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-minor"></div><div class="tick tick-major"></div>
                    </div>
                    <div class="carrot-strip ${class_naoh}" style="width: ${w_naoh}px; height: 30px;"></div>
                    <div class="dish-label" style="color: #ef4444;">1M NaOH (Caustic)</div>
                </div>

            </div>

            <div style="text-align: center; margin-top: 40px;">
                ${osmoState.phase === 'setup' ? `
                    <button onclick="startOsmosisIncubation()" style="background: #3b82f6; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); transition: 0.2s;">
                        <i class="fas fa-stopwatch"></i> Start 45 Min Incubation
                    </button>
                ` : osmoState.phase === 'incubating' ? `
                    <div style="color: #f59e0b;">
                        <i class="fas fa-spinner fa-spin fa-2x" style="margin-bottom: 10px;"></i>
                        <h3 style="font-family: 'Orbitron', sans-serif; letter-spacing: 2px; margin: 0;">OSMOSIS IN PROGRESS</h3>
                        <p style="font-size: 1.2rem; font-weight: bold; margin: 5px 0;">Time Remaining: <span id="osmo-timer-lcd">${osmoState.timer}</span> Mins</p>
                    </div>
                ` : osmoState.phase === 'ready' ? `
                    <h3 style="color: #10b981; font-family: 'Poppins'; margin: 0;"><i class="fas fa-check-circle"></i> Incubation Complete</h3>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 5px;">Carrot strips have reached osmotic equilibrium.</p>
                    <button onclick="measureOsmosisData()" style="margin-top: 10px; background: #f59e0b; color: #000; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer; font-family: 'Poppins'; font-weight: bold;"><i class="fas fa-ruler-combined"></i> Measure Length & Texture</button>
                ` : `
                    <h3 style="color: #38bdf8; font-family: 'Poppins'; margin: 0;"><i class="fas fa-clipboard-check"></i> Measurements Recorded</h3>
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 15px; flex-wrap: wrap;">
                        <div style="background: #161b22; border: 1px solid #38bdf8; padding: 10px; border-radius: 6px; color: #fff; font-size: 0.85rem; font-family: 'Poppins';"><b>Distilled Water:</b><br>L = 5.3 cm (Turgid)</div>
                        <div style="background: #161b22; border: 1px solid #94a3b8; padding: 10px; border-radius: 6px; color: #fff; font-size: 0.85rem; font-family: 'Poppins';"><b>0.5M NaCl:</b><br>L = 4.6 cm (Flaccid)</div>
                        <div style="background: #161b22; border: 1px solid #f59e0b; padding: 10px; border-radius: 6px; color: #fff; font-size: 0.85rem; font-family: 'Poppins';"><b>1M NaCl:</b><br>L = 4.3 cm (Plasmolyzed)</div>
                        <div style="background: #161b22; border: 1px solid #ef4444; padding: 10px; border-radius: 6px; color: #fff; font-size: 0.85rem; font-family: 'Poppins';"><b>1M NaOH:</b><br>L = 4.2 cm (Mushy/Slimy)</div>
                    </div>
                    <button onclick="initLab13_1Engine(document.getElementById('simulation-render-target'), document.getElementById('dynamic-data-table-container'))" style="margin-top: 15px; background: #475569; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-family: 'Poppins';"><i class="fas fa-undo"></i> Reset Tissues</button>
                `}
            </div>
        </div>
    `;

    workspace.innerHTML = uiHtml;
}

function startOsmosisIncubation() {
    osmoState.phase = 'incubating';
    renderLab13_1Canvas(document.getElementById('simulation-render-target'));
    
    let countdown = setInterval(() => {
        osmoState.timer--;
        
        let lcd = document.getElementById('osmo-timer-lcd');
        if (lcd) lcd.innerText = osmoState.timer;
        
        if (osmoState.timer <= 0) {
            clearInterval(countdown);
            osmoState.phase = 'ready';
            renderLab13_1Canvas(document.getElementById('simulation-render-target'));
        }
    }, 100); // 45 minutes simulated in 4.5 seconds
}

function measureOsmosisData() {
    osmoState.phase = 'measured';
    renderLab13_1Canvas(document.getElementById('simulation-render-target'));
}

function renderLab13_1Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">a. Predict a hypothesis for this experiment:</label>
                <input type="text" class="sim-input" id="rep_osmo_hyp" placeholder="As solute concentration increases, the tissue length will...">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">b. What principle or phenomenon guides this experiment?</label>
                <input type="text" class="sim-input" id="rep_osmo_prin" placeholder="Name the biological transport process...">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">c. Identify the variables involved:</label>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <input type="text" class="sim-input" id="rep_osmo_iv" placeholder="i. Independent Variable (altered factor)">
                    <input type="text" class="sim-input" id="rep_osmo_dv" placeholder="ii. Dependent Variable (measured factor)">
                    <input type="text" class="sim-input" id="rep_osmo_cv" placeholder="iii. Two Controlled Variables (kept constant)">
                </div>
            </div>

            <h4 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 10px;">d. Record your results:</h4>
            
            <!-- Texture Table -->
            <div class="table-responsive-wrapper" style="margin-bottom: 15px;">
                <table class="sim-table">
                    <thead><tr><th style="width: 20%;">Change in Texture</th><th>Distilled Water</th><th>0.5M NaCl</th><th>1M NaCl</th><th>1M NaOH</th></tr></thead>
                    <tbody>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Before immersion</td>
                            <td><input type="text" class="sim-input" value="Firm/Rigid" readonly></td>
                            <td><input type="text" class="sim-input" value="Firm/Rigid" readonly></td>
                            <td><input type="text" class="sim-input" value="Firm/Rigid" readonly></td>
                            <td><input type="text" class="sim-input" value="Firm/Rigid" readonly></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">After immersion</td>
                            <td><input type="text" class="sim-input" id="tex_dw" placeholder="e.g. Turgid"></td>
                            <td><input type="text" class="sim-input" id="tex_nacl1" placeholder="e.g. Flaccid"></td>
                            <td><input type="text" class="sim-input" id="tex_nacl2" placeholder="..."></td>
                            <td><input type="text" class="sim-input" id="tex_naoh" placeholder="..."></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Length Table -->
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead><tr><th style="width: 20%;">Change in Length</th><th>Distilled Water</th><th>0.5M NaCl</th><th>1M NaCl</th><th>1M NaOH</th></tr></thead>
                    <tbody>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Length before immersion</td>
                            <td><input type="number" class="sim-input" value="5.0" readonly></td>
                            <td><input type="number" class="sim-input" value="5.0" readonly></td>
                            <td><input type="number" class="sim-input" value="5.0" readonly></td>
                            <td><input type="number" class="sim-input" value="5.0" readonly></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Length after immersion</td>
                            <td><input type="number" step="0.1" class="sim-input" id="len_dw" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="len_nacl1" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="len_nacl2" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="len_naoh" placeholder="cm"></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Change in Length<br><span style="font-size:0.7rem; font-weight:normal;">(Final - Initial)</span></td>
                            <td><input type="number" step="0.1" class="sim-input" id="chg_dw" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="chg_nacl1" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="chg_nacl2" placeholder="cm"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="chg_naoh" placeholder="cm"></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Percentage change %<br><span style="font-size:0.7rem; font-weight:normal;">(Change / Initial * 100)</span></td>
                            <td><input type="number" step="0.1" class="sim-input" id="pct_dw" placeholder="%"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="pct_nacl1" placeholder="%"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="pct_nacl2" placeholder="%"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="pct_naoh" placeholder="%"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4 style="color: #38bdf8; font-family: 'Poppins'; margin-bottom: 10px;">f. Interpret the change in weight/size in the different solutions as fully as you can:</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                <textarea class="sim-input" id="inf_osmo_dw" rows="2" placeholder="Distilled water: Explain water movement direction..."></textarea>
                <textarea class="sim-input" id="inf_osmo_nacl1" rows="2" placeholder="0.5M NaCl: Explain water movement direction..."></textarea>
                <textarea class="sim-input" id="inf_osmo_nacl2" rows="2" placeholder="1M NaCl: Explain..."></textarea>
                <textarea class="sim-input" id="inf_osmo_naoh" rows="2" placeholder="1M NaOH: Consider both osmosis and chemical degradation of the cell wall..."></textarea>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">g. What conclusion can you draw concerning the water potential of the cells of the carrot tubers?</label>
                <textarea class="sim-input" id="rep_osmo_wp" rows="3" placeholder="Compare the water potential of the carrot cells to the Distilled Water and the NaCl solutions..."></textarea>
            </div>
            
            <p style="color: #ef4444; font-size: 0.8rem; margin-top: 15px;"><i class="fas fa-exclamation-triangle"></i> Note: The requirement to plot a graph (Part e) is omitted in this digital laboratory.</p>
        </div>
    `;
}

/* ==========================================================================
   LAB 13.2: COCOYAM CURVATURE & WEIGHT (OSMOSIS ENGINE)
   ========================================================================== */

let cocoState = {
    phase: 'setup', // 'setup', 'incubating', 'ready'
    timer: 30,      // 30 simulated minutes
    baseWeight: 2.50, // Base weight in grams
    animId: null
};

function initLab13_2Engine(workspace, tableContainer) {
    cocoState = { phase: 'setup', timer: 30, baseWeight: 2.50 };
    renderLab13_2Canvas(workspace);
    renderLab13_2Table(tableContainer);
    showLab13_2Intro();
}

function showLab13_2Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #10b981; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(16, 185, 129, 0.2); color: #fff;">
                <h2 style="color: #10b981; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-balance-scale"></i> Tissue Tension Setup</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>The system has cut three equal strips of fresh cocoyam petiole (stalk).</li>
                        <li>The <strong>dark green outer layer</strong> is the tough epidermis. The <strong>pale inner layer</strong> is the soft parenchyma tissue.</li>
                        <li>Their initial weight has been electronically recorded as exactly <strong>2.50 g</strong> each. They are currently perfectly straight.</li>
                        <li><strong>Step 1:</strong> Incubate the strips in the three solutions for 30 minutes.</li>
                        <li><strong>Step 2:</strong> Observe the direction of curvature and read the final weights from the digital scales.</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #10b981; color: #0f172a; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Acknowledge & Begin</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab13_2Canvas(workspace) {
    let uiHtml = '';
    
    const styleBlock = `
        <style>
            .coco-grid { display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; padding: 25px; border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); }
            .coco-station { display: flex; flex-direction: column; align-items: center; gap: 15px; }
            
            .petri-dish { width: 160px; height: 160px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.3); position: relative; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3); }
            
            /* Fluid colors */
            .fluid-dw { background: rgba(56, 189, 248, 0.15); }
            .fluid-nacl { background: rgba(255, 255, 255, 0.15); }
            .fluid-naoh { background: rgba(245, 158, 11, 0.05); }

            /* Cocoyam Strip Base (Split longitudinally) */
            .coco-strip { width: 120px; height: 30px; background: linear-gradient(to bottom, #166534 30%, #fef08a 30%); box-shadow: 2px 2px 5px rgba(0,0,0,0.5); transition: all 2s cubic-bezier(0.25, 1, 0.5, 1); position: relative; }
            
            /* Curvature States */
            /* Outward curve (Inner parenchyma absorbs water and expands, pushing tough epidermis out) */
            .curve-out { border-radius: 50% 50% 10px 10px / 100% 100% 10px 10px; height: 45px; width: 130px; }
            
            /* Inward curve (Inner parenchyma loses water and shrinks, pulling epidermis in) */
            .curve-in { border-radius: 10px 10px 50% 50% / 10px 10px 100% 100%; height: 25px; width: 110px; }
            
            /* Mushy base degradation */
            .curve-mush { border-radius: 10px 10px 60% 40% / 10px 10px 120% 80%; height: 20px; width: 105px; filter: blur(1px); opacity: 0.8; background: linear-gradient(to bottom, #14532d 30%, #d97706 30%); }

            .dish-label { position: absolute; bottom: -30px; text-align: center; width: 100%; font-family: 'Poppins'; font-weight: bold; font-size: 0.85rem; color: #cbd5e1; }
            
            .scale-display { background: #000; color: #ef4444; font-family: 'Orbitron', monospace; font-size: 1.5rem; padding: 5px 15px; border-radius: 6px; border: 2px solid #334155; box-shadow: inset 0 0 10px rgba(239,68,68,0.3); }
        </style>
    `;

    // Assign Textural CSS classes based on phase
    let class_dw = cocoState.phase === 'ready' ? 'curve-out' : '';
    let class_nacl = cocoState.phase === 'ready' ? 'curve-in' : '';
    let class_naoh = cocoState.phase === 'ready' ? 'curve-mush' : '';

    // Calculate Weights
    // DW: Gains water (+0.4g)
    // NaCl: Loses water (-0.6g)
    // NaOH: Loses water and tissue dissolves (-0.9g)
    let w_dw = cocoState.phase === 'ready' ? (cocoState.baseWeight + 0.45).toFixed(2) : cocoState.baseWeight.toFixed(2);
    let w_nacl = cocoState.phase === 'ready' ? (cocoState.baseWeight - 0.58).toFixed(2) : cocoState.baseWeight.toFixed(2);
    let w_naoh = cocoState.phase === 'ready' ? (cocoState.baseWeight - 0.82).toFixed(2) : cocoState.baseWeight.toFixed(2);

    uiHtml = styleBlock + `
        <div style="width: 100%;">
            <div class="coco-grid">
                
                <div class="coco-station">
                    <div class="petri-dish fluid-dw">
                        <div class="coco-strip ${class_dw}"></div>
                        <div class="dish-label">Distilled Water</div>
                    </div>
                    <div class="scale-display">${w_dw} g</div>
                </div>

                <div class="coco-station">
                    <div class="petri-dish fluid-nacl">
                        <div class="coco-strip ${class_nacl}"></div>
                        <div class="dish-label">1M NaCl</div>
                    </div>
                    <div class="scale-display">${w_nacl} g</div>
                </div>

                <div class="coco-station">
                    <div class="petri-dish fluid-naoh">
                        <div class="coco-strip ${class_naoh}"></div>
                        <div class="dish-label" style="color: #ef4444;">1M NaOH (Caustic)</div>
                    </div>
                    <div class="scale-display" style="color: #f59e0b;">${w_naoh} g</div>
                </div>

            </div>

            <div style="text-align: center; margin-top: 40px;">
                ${cocoState.phase === 'setup' ? `
                    <button onclick="startCocoIncubation()" style="background: #10b981; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); transition: 0.2s;">
                        <i class="fas fa-stopwatch"></i> Start 30 Min Incubation
                    </button>
                    <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 10px;">Top green layer = Epidermis. Bottom pale layer = Parenchyma.</p>
                ` : cocoState.phase === 'incubating' ? `
                    <div style="color: #f59e0b;">
                        <i class="fas fa-spinner fa-spin fa-2x" style="margin-bottom: 10px;"></i>
                        <h3 style="font-family: 'Orbitron', sans-serif; letter-spacing: 2px; margin: 0;">OSMOSIS IN PROGRESS</h3>
                        <p style="font-size: 1.2rem; font-weight: bold; margin: 5px 0;">Time Remaining: <span id="coco-timer-lcd">${cocoState.timer}</span> Mins</p>
                    </div>
                ` : `
                    <h3 style="color: #10b981; font-family: 'Poppins'; margin: 0;"><i class="fas fa-check-circle"></i> Incubation Complete</h3>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 5px;">Observe the curvature and record the final weights from the digital scales.</p>
                    <button onclick="initLab13_2Engine(document.getElementById('simulation-render-target'), document.getElementById('dynamic-data-table-container'))" style="margin-top: 10px; background: #475569; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-family: 'Poppins';"><i class="fas fa-undo"></i> Reset Tissues</button>
                `}
            </div>
        </div>
    `;

    workspace.innerHTML = uiHtml;
}

function startCocoIncubation() {
    cocoState.phase = 'incubating';
    renderLab13_2Canvas(document.getElementById('simulation-render-target'));
    
    let countdown = setInterval(() => {
        cocoState.timer--;
        
        let lcd = document.getElementById('coco-timer-lcd');
        if (lcd) lcd.innerText = cocoState.timer;
        
        if (cocoState.timer <= 0) {
            clearInterval(countdown);
            cocoState.phase = 'ready';
            renderLab13_2Canvas(document.getElementById('simulation-render-target'));
        }
    }, 100); // 30 minutes simulated in 3.0 seconds
}

function renderLab13_2Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">a. Predict a hypothesis for this experiment:</label>
                <input type="text" class="sim-input" id="rep_coco_hyp" placeholder="As solution concentration changes, the tissue will...">
            </div>

            <div style="margin-bottom: 25px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">b. What principle or phenomenon guides this experiment?</label>
                <input type="text" class="sim-input" id="rep_coco_prin" placeholder="Name the biological process...">
            </div>

            <h4 style="color: #38bdf8; font-family: 'Poppins'; margin-bottom: 10px;">c. Record your results:</h4>
            
            <!-- Weight Table -->
            <div class="table-responsive-wrapper" style="margin-bottom: 20px;">
                <table class="sim-table">
                    <thead><tr><th style="width: 25%;">i. Change in weight</th><th>Distilled Water</th><th>1M NaCl</th><th>1M NaOH</th></tr></thead>
                    <tbody>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Weight before immersion</td>
                            <td><input type="number" class="sim-input" value="2.50" readonly></td>
                            <td><input type="number" class="sim-input" value="2.50" readonly></td>
                            <td><input type="number" class="sim-input" value="2.50" readonly></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Weight after immersion</td>
                            <td><input type="number" step="0.01" class="sim-input" id="wt_dw" placeholder="g"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="wt_nacl" placeholder="g"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="wt_naoh" placeholder="g"></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Change in weight after 30 mins<br><span style="font-size:0.7rem; font-weight:normal;">(Final - Initial)</span></td>
                            <td><input type="number" step="0.01" class="sim-input" id="wt_chg_dw" placeholder="g"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="wt_chg_nacl" placeholder="g"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="wt_chg_naoh" placeholder="g"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Curvature Description Table (Replaced Drawing) -->
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead><tr><th style="width: 25%;">ii. Change in curvature</th><th>Distilled Water</th><th>1M NaCl</th><th>1M NaOH</th></tr></thead>
                    <tbody>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Degree of curvature before immersion</td>
                            <td><input type="text" class="sim-input" value="Straight" readonly></td>
                            <td><input type="text" class="sim-input" value="Straight" readonly></td>
                            <td><input type="text" class="sim-input" value="Straight" readonly></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left; font-weight:bold;">Degree of curvature after 30 mins<br><span style="font-size:0.7rem; font-weight:normal;">(Describe the bend)</span></td>
                            <td><input type="text" class="sim-input" id="curv_dw" placeholder="e.g. Curves outward"></td>
                            <td><input type="text" class="sim-input" id="curv_nacl" placeholder="e.g. Curves inward"></td>
                            <td><input type="text" class="sim-input" id="curv_naoh" placeholder="..."></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 10px;">d. Interpret the change in curvature as fully as you can:</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                <textarea class="sim-input" id="inf_curv_dw" rows="2" placeholder="Distilled water: Which layer expanded more and why?"></textarea>
                <textarea class="sim-input" id="inf_curv_nacl" rows="2" placeholder="1M NaCl: Which layer shrank more and why?"></textarea>
                <textarea class="sim-input" id="inf_curv_naoh" rows="2" placeholder="1M NaOH: Consider both osmosis and chemical degradation..."></textarea>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">e. What conclusion can you draw concerning the water potential of the protoplasm?</label>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <input type="text" class="sim-input" id="wp_dw" placeholder="Distilled water vs Protoplasm...">
                    <input type="text" class="sim-input" id="wp_nacl" placeholder="1M NaCl vs Protoplasm...">
                    <input type="text" class="sim-input" id="wp_naoh" placeholder="1M NaOH vs Protoplasm...">
                </div>
            </div>
            
            <p style="color: #ef4444; font-size: 0.8rem; margin-top: 15px;"><i class="fas fa-exclamation-triangle"></i> Note: The requirement to draw diagrams (Part c.ii) is omitted in this digital laboratory. Please describe the curvature in text.</p>
        </div>
    `;
}

/* ==========================================================================
   LAB 13.3: STOMATAL OSMOSIS (DIGITAL MICROSCOPE ENGINE)
   ========================================================================== */

let stomaState = {
    solution: 'none', // 'none', 'water', 'nacl'
    aperture: 5,      // Width of the stomatal pore (starts partially open/flaccid)
    turgor: 0.5,      // Cell plumpness (0 to 1)
    animId: null
};

function initLab13_3Engine(workspace, tableContainer) {
    stomaState = { solution: 'none', aperture: 5, turgor: 0.5 };
    renderLab13_3Canvas(workspace);
    renderLab13_3Table(tableContainer);
    showLab13_3Intro();
}

function showLab13_3Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #10b981; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(16, 185, 129, 0.2); color: #fff;">
                <h2 style="color: #10b981; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-microscope"></i> Microscopic Osmosis Setup</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>The system has prepared a wet mount of the lower epidermis of a <em>Tradescantia</em> leaf.</li>
                        <li>You are currently viewing the tissue under High Power (400x magnification).</li>
                        <li><strong>Step 1:</strong> Flush the slide with <strong>Distilled Water</strong> and observe the guard cells. Wait 5 minutes (simulated).</li>
                        <li><strong>Step 2:</strong> Flush the slide with <strong>1M NaCl</strong> and observe the difference.</li>
                        <li><strong>Notice:</strong> Look closely at the green chloroplasts inside the guard cells, and note how the surrounding epidermal cells lack them!</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #10b981; color: #0f172a; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Look through Lens</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab13_3Canvas(workspace) {
    const styleBlock = `
        <style>
            .stoma-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 25px; border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); }
            
            .microscope-viewport { width: 350px; height: 350px; border-radius: 50%; border: 15px solid #000; box-shadow: 0 0 0 5px #334155, inset 0 0 40px rgba(0,0,0,0.9); background: #dcfce7; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; margin: 0 auto; }
            
            /* Lens glare effect */
            .lens-glare { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%); pointer-events: none; z-index: 100; }
            
            .vignette { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; box-shadow: inset 0 0 60px rgba(0,0,0,0.8); pointer-events: none; z-index: 99; }
        </style>
    `;

    workspace.innerHTML = styleBlock + `
        <div style="width: 100%;">
            <div class="stoma-grid">
                
                <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; justify-content: center; gap: 15px;">
                    <div style="background: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #334155;">
                        <h4 style="color: #38bdf8; font-family: 'Poppins'; margin-top: 0;"><i class="fas fa-tint"></i> Slide Irrigation Controls</h4>
                        <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 15px;">Select a solution to draw under the coverslip.</p>
                        
                        <button onclick="applyStomaSolution('water')" id="btn-stoma-water" style="width: 100%; margin-bottom: 10px; background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; transition: 0.2s;">
                            Flush with Distilled Water
                        </button>
                        
                        <button onclick="applyStomaSolution('nacl')" id="btn-stoma-nacl" style="width: 100%; background: #eab308; color: #0f172a; border: none; padding: 12px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; transition: 0.2s;">
                            Flush with 1M NaCl
                        </button>
                    </div>
                </div>

                <div style="flex: 1.5; min-width: 350px; display: flex; justify-content: center; position: relative;">
                    <div class="microscope-viewport">
                        <canvas id="canvas-stoma" width="350" height="350" style="background: transparent;"></canvas>
                        <div class="lens-glare"></div>
                        <div class="vignette"></div>
                    </div>
                </div>

            </div>
        </div>
    `;

    stomaLoop();
}

function applyStomaSolution(sol) {
    stomaState.solution = sol;
    
    if (sol === 'water') {
        document.getElementById('btn-stoma-water').innerHTML = `<i class="fas fa-spinner fa-spin"></i> Incubating 5 Mins...`;
        document.getElementById('btn-stoma-nacl').innerHTML = `Flush with 1M NaCl`;
    } else {
        document.getElementById('btn-stoma-nacl').innerHTML = `<i class="fas fa-spinner fa-spin"></i> Incubating 5 Mins...`;
        document.getElementById('btn-stoma-water').innerHTML = `Flush with Distilled Water`;
    }

    setTimeout(() => {
        if (sol === 'water') {
            document.getElementById('btn-stoma-water').innerHTML = `<i class="fas fa-check-circle"></i> Distilled Water Active`;
        } else {
            document.getElementById('btn-stoma-nacl').innerHTML = `<i class="fas fa-check-circle"></i> 1M NaCl Active`;
        }
    }, 1500);
}

function stomaLoop() {
    const canvas = document.getElementById('canvas-stoma'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    // Physics Engine: Target states based on osmosis
    let targetAperture = 5; // Default resting
    let targetTurgor = 0.5;

    if (stomaState.solution === 'water') {
        targetAperture = 25; // Fully open!
        targetTurgor = 1.0;  // Fully plump/turgid
    } else if (stomaState.solution === 'nacl') {
        targetAperture = 0;  // Tightly closed!
        targetTurgor = 0.1;  // Flaccid/plasmolyzed
    }

    // Smooth transition animations
    stomaState.aperture += (targetAperture - stomaState.aperture) * 0.02;
    stomaState.turgor += (targetTurgor - stomaState.turgor) * 0.02;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // --- 1. Draw Background Epidermal Cells ---
    // They are jigsaw-puzzle shaped and transparent (no chloroplasts)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)'; // Faint green cell walls
    ctx.lineWidth = 2;
    ctx.fillStyle = `rgba(187, 247, 208, ${0.3 + (stomaState.turgor*0.2)})`; // Fill changes slightly with turgor

    // Draw some random interlocking polygons to simulate pavement cells
    const cellPaths = [
        [[0,0], [100,20], [150,-50], [0,-80]],
        [[100,20], [250,10], [300,80], [150,100]],
        [[0,80], [120,90], [100,180], [0,200]],
        [[250,10], [400,0], [400,150], [280,120]],
        [[100,180], [220,150], [280,280], [150,350], [0,350]],
        [[280,120], [400,150], [400,350], [280,280]]
    ];

    cellPaths.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        for(let i=1; i<path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
        ctx.closePath();
        
        // If plasmolysis is happening, pull the cytoplasm (fill) away from the cell walls
        if (stomaState.turgor < 0.3) {
            ctx.stroke(); // Draw wall
            ctx.save();
            ctx.translate(cx, cy); ctx.scale(0.85, 0.85); ctx.translate(-cx, -cy); // Shrink protoplast
            ctx.fill();
            ctx.restore();
        } else {
            ctx.fill(); ctx.stroke();
        }
    });

    // --- 2. Draw The Stoma (Guard Cells) ---
    // Left Guard Cell
    ctx.save();
    ctx.translate(cx - (stomaState.aperture/2) - 15, cy);
    drawGuardCell(ctx, -1, stomaState.turgor, stomaState.aperture);
    ctx.restore();

    // Right Guard Cell
    ctx.save();
    ctx.translate(cx + (stomaState.aperture/2) + 15, cy);
    drawGuardCell(ctx, 1, stomaState.turgor, stomaState.aperture);
    ctx.restore();

    // --- 3. Draw The Pore (Stomatal Aperture) ---
    // If open, it's a dark gap showing the spongy mesophyll space below
    if (stomaState.aperture > 1) {
        ctx.fillStyle = 'rgba(0, 50, 0, 0.8)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, stomaState.aperture/2, 50, 0, 0, Math.PI*2);
        ctx.fill();
    }

    stomaState.animId = requestAnimationFrame(stomaLoop);
}

function drawGuardCell(ctx, direction, turgor, aperture) {
    // direction: -1 for left, 1 for right
    // The more turgid the cell, the more the thin outer wall bows outward.
    let bowOuter = 30 + (turgor * 40); 
    let bowInner = 10 + (aperture * 0.5); // Inner thick wall bends slightly when open
    let height = 120;

    // Fill Color (Greener when turgid)
    ctx.fillStyle = `rgba(34, 197, 94, ${0.6 + (turgor*0.4)})`;
    
    // Draw the kidney bean shape
    ctx.beginPath();
    ctx.moveTo(0, -height/2);
    // Outer thin wall
    ctx.quadraticCurveTo(direction * bowOuter, 0, 0, height/2);
    // Inner thick wall
    ctx.quadraticCurveTo(direction * bowInner, 0, 0, -height/2);
    ctx.fill();

    // Draw the Thick Inner Wall (Key biological feature!)
    ctx.strokeStyle = '#064e3b'; // Dark green
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, -height/2);
    ctx.quadraticCurveTo(direction * bowInner, 0, 0, height/2);
    ctx.stroke();

    // Draw the Thin Outer Wall
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -height/2);
    ctx.quadraticCurveTo(direction * bowOuter, 0, 0, height/2);
    ctx.stroke();

    // Add Chloroplasts! (Guard cells have them, regular epidermal cells don't)
    ctx.fillStyle = '#14532d'; // Very dark green
    // Pseudo-random but fixed positions based on the curve
    for (let i = -40; i <= 40; i+=20) {
        let xOffset = direction * (bowOuter/2) * (1 - Math.abs(i)/60);
        ctx.beginPath();
        ctx.arc(xOffset, i, 4, 0, Math.PI*2);
        ctx.fill();
    }
}

function renderLab13_3Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">f. What phenomenon is being observed?</label>
                <input type="text" class="sim-input" id="rep_stoma_phenom" placeholder="e.g. Osmosis, Plasmolysis, Turgidity...">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">g. What are the structural differences between the guard cells and epidermal cells?</label>
                <textarea class="sim-input" id="rep_stoma_struct" rows="2" placeholder="Mention cell shape, wall thickness, and presence of organelles..."></textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">h. Compare the diameter of the stomata in the two different solutions:</label>
                <input type="text" class="sim-input" id="rep_stoma_diam" placeholder="Distilled water = ?, 1M NaCl = ?">
            </div>

            <h4 style="color: #38bdf8; font-family: 'Poppins'; margin-bottom: 10px;">Account for the behaviors of the guard cell and stomata:</h4>
            
            <div style="margin-bottom: 15px;">
                <label style="color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 5px;">i. Mounted under Distilled Water:</label>
                <textarea class="sim-input" id="rep_stoma_dw" rows="3" placeholder="Explain water potential, endosmosis, turgidity, and the role of the unevenly thickened walls..."></textarea>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 5px;">j. Mounted under 1M NaCl solution:</label>
                <textarea class="sim-input" id="rep_stoma_nacl" rows="3" placeholder="Explain water potential, exosmosis, flaccidity/plasmolysis, and pore closure..."></textarea>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">k. Conclusion:</label>
                <textarea class="sim-input" id="rep_stoma_concl" rows="2" placeholder="Summarize the relationship between guard cell turgor and stomatal aperture..."></textarea>
            </div>
            
            <p style="color: #ef4444; font-size: 0.8rem; margin-top: 15px;"><i class="fas fa-exclamation-triangle"></i> Note: The requirement to draw labeled diagrams (Parts e, l, m) is omitted in this digital laboratory interface.</p>
        </div>
    `;
}

/* ==========================================================================
   LAB 16.1: ENZYME DEHYDROGENASE (METHYLENE BLUE REDUCTION ENGINE)
   ========================================================================== */

let dehydroState = {
    phase: 'setup', // 'setup', 'running', 'done'
    timer: 0.0,     // Simulated minutes
    lastTick: 0,
    animId: null
};

// Target times in simulated minutes for each dilution to decolorize
const dehydroTimes = {
    100: 2.0,
    75: 3.5,
    50: 6.0,
    25: 12.0,
    0: Infinity // Never decolorizes
};

function initLab16_1Engine(workspace, tableContainer) {
    dehydroState = { phase: 'setup', timer: 0.0, lastTick: 0 };
    renderLab16_1Canvas(workspace);
    renderLab16_1Table(tableContainer);
    showLab16_1Intro();
}

function showLab16_1Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #3b82f6; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(59, 130, 246, 0.2); color: #fff;">
                <h2 style="color: #3b82f6; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-eye-dropper"></i> Colorimetric Reduction Setup</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>The system has prepared 5 test tubes with different percentage dilutions of yeast suspension (100%, 75%, 50%, 25%, and 0%).</li>
                        <li><strong>Step 1:</strong> 1ml of Methylene Blue dye has been added to all tubes. They are all currently oxidized (Blue).</li>
                        <li><strong>Step 2:</strong> Start the 30°C incubation timer.</li>
                        <li><strong>Step 3:</strong> Watch closely! As the yeast respires, dehydrogenase enzymes release electrons, reducing the dye to a colorless/beige state. Record the exact minute each tube finishes decolorizing.</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #3b82f6; color: #fff; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Acknowledge & Begin</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab16_1Canvas(workspace) {
    const styleBlock = `
        <style>
            .dehydro-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 30px; border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); position: relative; }
            
            .water-bath-bg { position: absolute; bottom: 0; left: 0; width: 100%; height: 160px; background: rgba(56, 189, 248, 0.15); border-radius: 0 0 16px 16px; border-top: 2px dashed #38bdf8; pointer-events: none; z-index: 1; }

            .color-tube { width: 44px; height: 180px; border: 2px solid rgba(255,255,255,0.6); border-top: none; border-radius: 0 0 22px 22px; position: relative; background: rgba(255,255,255,0.05); overflow: hidden; box-shadow: inset -5px -5px 15px rgba(0,0,0,0.5); margin: 0 auto; z-index: 10; }
            
            /* The Fluid */
            .d-fluid { position: absolute; bottom: 0; width: 100%; height: 60%; border-radius: 0 0 20px 20px; 
                /* Start Blue. We will transition to Beige via Javascript inline styles */
                background-color: rgba(37, 99, 235, 0.9);
            }
            
            .yeast-particles { position: absolute; width: 100%; height: 100%; background-image: radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px); background-size: 8px 8px; opacity: 0.5; }
        </style>
    `;

    // Calculate real-time CSS transition durations based on our simulation speed.
    // Let's say 1 simulated minute = 2 real seconds.
    // Time to decolorize = target * 2s.
    let simMultiplier = 2; 

    let uiHtml = styleBlock + `
        <div style="width: 100%;">
            
            <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 2px solid #30363d; text-align: center; margin-bottom: 20px; max-width: 300px; margin-left: auto; margin-right: auto;">
                <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">INCUBATION TIMER (MINS)</div>
                <div class="lcd-screen" id="dehydro-timer" style="font-size:3rem; color:#facc15; background:#000; padding:10px; border-radius:6px; font-weight:bold; font-family:'Orbitron', sans-serif;">0.00</div>
            </div>

            <div class="dehydro-grid">
                <div class="water-bath-bg">
                    <span style="position: absolute; top: -25px; right: 15px; color: #38bdf8; font-weight: bold; font-family: 'Poppins';">30°C Water Bath</span>
                </div>
                
                ${[100, 75, 50, 25, 0].map(conc => `
                    <div style="text-align: center; flex: 1; min-width: 70px; z-index: 10;">
                        <div class="color-tube">
                            <div class="d-fluid" id="fluid-conc-${conc}" style="transition: background-color ${dehydroTimes[conc] * simMultiplier}s linear;">
                                <div class="yeast-particles"></div>
                            </div>
                        </div>
                        <h3 style="color:#fff; margin: 10px 0 2px; font-family:'Poppins';">${conc}%</h3>
                        <span style="color:#cbd5e1; font-size:0.7rem;">Yeast</span>
                    </div>
                `).join('')}

            </div>

            <div style="text-align: center; margin-top: 20px;">
                ${dehydroState.phase === 'setup' ? `
                    <button onclick="startDehydroTimer()" style="background: #eab308; color: #0f172a; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(234, 179, 8, 0.4); transition: 0.2s;">
                        <i class="fas fa-play"></i> Start Timer & Incubation
                    </button>
                ` : dehydroState.phase === 'running' ? `
                    <button disabled style="background: #475569; color: #fff; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: not-allowed; font-size: 1.1rem;">
                        <i class="fas fa-spinner fa-spin"></i> Observing Decolorization...
                    </button>
                ` : `
                    <button onclick="initLab16_1Engine(document.getElementById('simulation-render-target'), document.getElementById('dynamic-data-table-container'))" style="background: #475569; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-family: 'Poppins';"><i class="fas fa-undo"></i> Reset Apparatus</button>
                `}
            </div>
        </div>
    `;

    workspace.innerHTML = uiHtml;
}

function startDehydroTimer() {
    dehydroState.phase = 'running';
    dehydroState.lastTick = performance.now();
    renderLab16_1Canvas(document.getElementById('simulation-render-target'));

    // Trigger the CSS color transitions for the tubes!
    // Reduced Methylene blue is colorless, revealing the beige yeast suspension beneath.
    const beigeColor = 'rgba(245, 245, 220, 0.9)';
    
    // Tubes with yeast will transition to beige. Tube 0% (Water + Dye) stays blue forever.
    setTimeout(() => {
        document.getElementById('fluid-conc-100').style.backgroundColor = beigeColor;
        document.getElementById('fluid-conc-75').style.backgroundColor = beigeColor;
        document.getElementById('fluid-conc-50').style.backgroundColor = beigeColor;
        document.getElementById('fluid-conc-25').style.backgroundColor = beigeColor;
        // 0 stays blue
    }, 100);

    dehydroLoop();
}

function dehydroLoop() {
    if (dehydroState.phase !== 'running') return;

    const now = performance.now();
    // 1 real second = 0.5 simulated minutes (i.e. 2 real seconds = 1 sim min)
    let dtMins = ((now - dehydroState.lastTick) / 1000) * 0.5;
    dehydroState.timer += dtMins;
    dehydroState.lastTick = now;

    let lcd = document.getElementById('dehydro-timer');
    if (lcd) lcd.innerText = dehydroState.timer.toFixed(2);

    // Auto-stop after 15 simulated minutes (since 25% finishes at 12 mins)
    if (dehydroState.timer >= 15.0) {
        dehydroState.phase = 'done';
        dehydroState.timer = 15.0;
        if (lcd) lcd.innerText = "15.00";
        renderLab16_1Canvas(document.getElementById('simulation-render-target'));
        return;
    }

    dehydroState.animId = requestAnimationFrame(dehydroLoop);
}

function renderLab16_1Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">a. Suggest a Hypothesis for your experiment:</label>
                <input type="text" class="sim-input" id="rep_dh_hyp" placeholder="As yeast concentration increases, the rate of dye reduction...">
            </div>

            <div style="margin-bottom: 25px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">b. Describe your procedure:</label>
                <textarea class="sim-input" id="rep_dh_proc" rows="3" placeholder="Briefly detail dilutions, adding methylene blue, incubating, and timing..."></textarea>
            </div>

            <h4 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 10px;">c. Record your results on the table below:</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead>
                        <tr>
                            <th style="width: 25%; text-align: left;">% Dilution of stock</th>
                            <th>0%</th>
                            <th>25%</th>
                            <th>50%</th>
                            <th>75%</th>
                            <th>100%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="color:#cbd5e1; text-align:left; font-weight: bold;">Time for decolorisation (minutes)</td>
                            <td><input type="text" class="sim-input" id="time_0" placeholder="e.g. None"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="time_25" placeholder="min"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="time_50" placeholder="min"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="time_75" placeholder="min"></td>
                            <td><input type="number" step="0.1" class="sim-input" id="time_100" placeholder="min"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4 style="color: #38bdf8; font-family: 'Poppins'; margin-bottom: 10px;">e. Interpret your result as fully as you can:</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                <input type="text" class="sim-input" id="inf_dh_0" placeholder="At 0% dilution (Control)...">
                <input type="text" class="sim-input" id="inf_dh_25" placeholder="At 25% dilution...">
                <input type="text" class="sim-input" id="inf_dh_50" placeholder="At 50% dilution...">
                <input type="text" class="sim-input" id="inf_dh_75" placeholder="At 75% dilution...">
                <input type="text" class="sim-input" id="inf_dh_100" placeholder="At 100% dilution (Max enzyme)...">
            </div>
            
            <div style="margin-bottom: 10px;">
                <label style="color: #10b981; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">f. Conclusion:</label>
                <textarea class="sim-input" id="rep_dh_concl" rows="2" placeholder="Summarize the relationship between enzyme concentration and reaction rate..."></textarea>
            </div>
            
            <p style="color: #ef4444; font-size: 0.8rem; margin-top: 15px;"><i class="fas fa-exclamation-triangle"></i> Note: The requirement to plot a bar chart (Part d) is omitted in this digital laboratory.</p>
        </div>
    `;
}

/* ==========================================================================
   LAB 17.1: TRANSPIRATION IN PLANT SPECIES (ENVIRONMENTAL ENGINE)
   ========================================================================== */

let transState = {
    species: 'sunflower', // 'sunflower' or 'mango'
    phase: 'idle', // 'idle', 'hanging', 'weighing'
    timeMins: 0,
    animId: null,
    // Base data mapping from the manual (Sunflower: 8, 7.2, 6.0, 5.4, 4.2)
    // Mango loses much less due to waxy cuticle (e.g., 8.5, 8.3, 8.2, 8.1, 8.0)
    data: {
        sunflower: { 0: 8.0, 15: 7.2, 30: 6.0, 45: 5.4, 60: 4.2 },
        mango: { 0: 8.5, 15: 8.3, 30: 8.2, 45: 8.1, 60: 8.0 }
    }
};

function initLab17_1Engine(workspace, tableContainer) {
    transState = { species: 'sunflower', phase: 'idle', timeMins: 0, data: transState.data };
    renderLab17_1Canvas(workspace);
    renderLab17_1Table(tableContainer);
    showLab17_1Intro();
}

function showLab17_1Intro() {
    const popupHtml = `
        <div id="lab-intro-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px);">
            <div style="background: #0f172a; border: 2px solid #10b981; padding: 35px; border-radius: 16px; max-width: 550px; width: 90%; box-shadow: 0 15px 50px rgba(16, 185, 129, 0.2); color: #fff;">
                <h2 style="color: #10b981; margin-top: 0; font-family: 'Poppins';"><i class="fas fa-wind"></i> Transpiration Simulator</h2>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;">
                    <p><strong>System Protocol:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>You will measure water loss by tying 5 leaves to a string and hanging them in an airy environment.</li>
                        <li><strong>Step 1:</strong> Select a plant species (Sunflower or Mango).</li>
                        <li><strong>Step 2:</strong> Click "Hang Outside". The simulation will automatically fast-forward time, pausing every 15 minutes to bring the leaves inside to the digital balance.</li>
                        <li><strong>Step 3:</strong> Record the weight from the balance at 0, 15, 30, 45, and 60 minutes.</li>
                        <li><strong>Notice:</strong> Watch how the sunflower leaves wilt and droop over the hour, while the mango leaves remain firm!</li>
                    </ul>
                </div>
                <button onclick="document.getElementById('lab-intro-modal').remove()" style="background: #10b981; color: #0f172a; border: none; padding: 14px 24px; width: 100%; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">Acknowledge & Begin</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function renderLab17_1Canvas(workspace) {
    const styleBlock = `
        <style>
            .trans-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 25px; border-radius: 16px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); }
            .env-window { width: 100%; height: 200px; background: linear-gradient(to bottom, #87CEEB 0%, #e0f2fe 100%); border-radius: 12px; border: 4px solid #334155; position: relative; overflow: hidden; box-shadow: inset 0 0 20px rgba(0,0,0,0.2); }
            
            /* Clouds moving outside */
            .cloud { position: absolute; background: white; border-radius: 50%; opacity: 0.8; filter: blur(2px); animation: drift linear infinite; }
            @keyframes drift { from { left: -50px; } to { left: 100%; } }
        </style>
    `;

    let weightDisp = "0.00";
    if (transState.phase === 'weighing') {
        weightDisp = transState.data[transState.species][transState.timeMins].toFixed(2);
    } else if (transState.phase === 'idle' && transState.timeMins === 0) {
        weightDisp = transState.data[transState.species][0].toFixed(2);
    }

    workspace.innerHTML = styleBlock + `
        <div style="width: 100%;">
            
            <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
                <button onclick="switchTransSpecies('sunflower')" id="btn-sp-sunflower" style="background:${transState.species === 'sunflower' ? '#10b981' : '#334155'}; color:white; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; font-family:'Poppins';">Sunflower Leaves</button>
                <button onclick="switchTransSpecies('mango')" id="btn-sp-mango" style="background:${transState.species === 'mango' ? '#10b981' : '#334155'}; color:white; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer; font-family:'Poppins';">Mango Leaves</button>
            </div>

            <div class="trans-grid">
                
                <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 15px;">
                    <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">ELAPSED TIME (MINS)</div>
                        <div class="lcd-screen" id="trans-timer-lcd" style="font-size:2.5rem; color:#facc15; background:#000; padding:10px; border-radius:6px; font-weight:bold; font-family:'Orbitron';">${transState.timeMins}</div>
                    </div>
                    
                    <div style="background: #161b22; padding: 20px; border-radius: 8px; border: 2px solid #30363d; text-align: center;">
                        <div style="color:#8b949e; font-size:0.8rem; margin-bottom:5px; font-family:'Orbitron';">DIGITAL BALANCE (g)</div>
                        <div class="lcd-screen" id="trans-weight-lcd" style="font-size:2.5rem; color:${transState.phase === 'hanging' ? '#475569' : '#ef4444'}; background:#000; padding:10px; border-radius:6px; font-weight:bold; font-family:'Orbitron';">${transState.phase === 'hanging' ? '---' : weightDisp}</div>
                        
                        <!-- NEW LOGGING BUTTON -->
                        ${(transState.phase === 'idle' || transState.phase === 'weighing') ? `
                            <button onclick="logTransWeight(event)" style="width:100%; margin-top:15px; background:#facc15; color:#0f172a; border:none; padding:10px; border-radius:6px; font-weight:bold; font-family:'Poppins'; cursor:pointer; transition:0.2s;">
                                <i class="fas fa-edit"></i> Log Weight to Table
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div style="flex: 1.5; min-width: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
                    
                    <div class="env-window" id="env-window">
                        <div class="cloud" style="width:60px; height:20px; top:20px; animation-duration:15s;"></div>
                        <div class="cloud" style="width:80px; height:25px; top:50px; animation-duration:22s; animation-delay: 2s;"></div>
                        <canvas id="canvas-trans" width="300" height="200" style="position: absolute; top:0; left:0; width:100%; height:100%;"></canvas>
                    </div>
                    
                    <div style="margin-top: 15px; width: 100%;">
                        ${transState.phase === 'idle' || transState.phase === 'weighing' ? `
                            ${transState.timeMins < 60 ? `
                                <button onclick="startTransHanging()" style="width: 100%; background: #38bdf8; color: #0f172a; border: none; padding: 12px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4);">
                                    <i class="fas fa-wind"></i> Hang Outside (Resume Timer)
                                </button>
                            ` : `
                                <button onclick="initLab17_1Engine(document.getElementById('simulation-render-target'), document.getElementById('dynamic-data-table-container'))" style="width: 100%; background: #475569; color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: pointer; font-size: 1.1rem;">
                                    <i class="fas fa-undo"></i> Reset Experiment
                                </button>
                            `}
                        ` : `
                            <button disabled style="width: 100%; background: #475569; color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: bold; font-family: 'Poppins'; cursor: not-allowed; font-size: 1.1rem;">
                                <i class="fas fa-spinner fa-spin"></i> Transpiration in Progress...
                            </button>
                        `}
                    </div>
                </div>

            </div>
        </div>
    `;

    if(transState.animId) cancelAnimationFrame(transState.animId);
    transLoop();
}

// NEW LOGGING FUNCTION
window.logTransWeight = function(e) {
    let t = transState.timeMins;
    let spPrefix = transState.species === 'mango' ? 'm' : 's';
    let inputId = spPrefix + '_w' + t;
    let inputEl = document.getElementById(inputId);
    
    if (inputEl) {
        // Automatically insert the weight into the correct table cell
        inputEl.value = transState.data[transState.species][t].toFixed(2);
        
        // Visual feedback on the button
        let btn = e.currentTarget;
        let oldHtml = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check"></i> Recorded at ${t} mins`;
        btn.style.background = '#10b981';
        btn.style.color = '#fff';
        
        setTimeout(() => {
            btn.innerHTML = oldHtml;
            btn.style.background = '#facc15';
            btn.style.color = '#0f172a';
        }, 1500);
    }
};

function switchTransSpecies(sp) {
    // Automatically reset the experiment state for the new species
    transState.species = sp;
    transState.phase = 'idle';
    transState.timeMins = 0;
    
    // Re-render the canvas to show the fresh setup
    renderLab17_1Canvas(document.getElementById('simulation-render-target'));
}

function startTransHanging() {
    transState.phase = 'hanging';
    document.getElementById('trans-weight-lcd').innerText = "---";
    document.getElementById('trans-weight-lcd').style.color = '#475569';
    renderLab17_1Canvas(document.getElementById('simulation-render-target'));

    let targetTime = transState.timeMins + 15;
    
    let fastForward = setInterval(() => {
        transState.timeMins++;
        document.getElementById('trans-timer-lcd').innerText = transState.timeMins;
        
        if (transState.timeMins >= targetTime) {
            clearInterval(fastForward);
            transState.phase = 'weighing';
            renderLab17_1Canvas(document.getElementById('simulation-render-target'));
        }
    }, 100); // 1.5 seconds to do 15 minutes!
}

function transLoop() {
    const canvas = document.getElementById('canvas-trans'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0,0, canvas.width, canvas.height);

    const cx = canvas.width / 2;

    if (transState.phase === 'hanging') {
        // Draw clothesline
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(canvas.width, 30); ctx.stroke();
        
        // Sway calculation based on wind
        let sway = Math.sin(performance.now() / 300) * 10;
        
        // Wilt calculation based on species and time
        // Sunflower wilts heavily (droops). Mango stays firm.
        let wiltFactor = 0;
        if (transState.species === 'sunflower') {
            wiltFactor = (transState.timeMins / 60) * 40; // Droops up to 40px down
        }

        // Draw Leaves
        ctx.fillStyle = transState.species === 'mango' ? '#064e3b' : '#22c55e'; // Mango is dark/thick, Sunflower is bright/thin
        
        for(let i=0; i<5; i++) {
            let lx = cx - 80 + (i*40);
            
            // String to leaf
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx, 30); ctx.lineTo(lx + (sway*0.5), 60); ctx.stroke();
            
            // Draw Leaf (Ellipse that droops)
            ctx.save();
            ctx.translate(lx + (sway*0.5), 60);
            ctx.rotate((sway * 0.02) + (i%2==0 ? 0.2 : -0.2)); // Wind rotation
            
            ctx.beginPath();
            if (transState.species === 'mango') {
                // Long, rigid mango leaf
                ctx.ellipse(0, 30, 10, 40, 0, 0, Math.PI*2);
            } else {
                // Broad sunflower leaf that wilts (gets longer/thinner and bends)
                ctx.ellipse(0, 20 + (wiltFactor*0.5), 18 - (wiltFactor*0.1), 25 + (wiltFactor*0.3), 0, 0, Math.PI*2);
            }
            ctx.fill();
            
            // Leaf veins
            ctx.strokeStyle = transState.species === 'mango' ? '#022c22' : '#166534';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, transState.species==='mango' ? 65 : (40 + wiltFactor)); ctx.stroke();
            
            ctx.restore();
        }
    } else {
        // Phase is WEIGHING or IDLE (Inside on the balance)
        ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, canvas.width, canvas.height); // Dark lab background
        
        // Balance Pan
        ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.ellipse(cx, 160, 80, 20, 0, 0, Math.PI*2); ctx.fill();
        
        // Leaves bundled on the pan
        ctx.fillStyle = transState.species === 'mango' ? '#064e3b' : '#22c55e';
        let wiltFactor = transState.species === 'sunflower' ? (transState.timeMins / 60) * 15 : 0; // Less squish visually when flat
        
        for(let i=0; i<5; i++) {
            ctx.save();
            ctx.translate(cx - 20 + (i*10), 150 - (i*5));
            ctx.rotate(1.0 + (i*0.5));
            ctx.beginPath();
            if (transState.species === 'mango') ctx.ellipse(0, 0, 10, 40, 0, 0, Math.PI*2);
            else ctx.ellipse(0, 0, 18 - wiltFactor, 25, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
    }

    transState.animId = requestAnimationFrame(transLoop);
}

function renderLab17_1Table(tableContainer) {
    tableContainer.innerHTML = `
        <div style="background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            
            <h4 style="color: #10b981; font-family: 'Poppins'; margin-bottom: 10px;">a. Mango leaves</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead><tr><th style="width:30%; text-align:left;">Time (minutes)</th><th>0</th><th>15</th><th>30</th><th>45</th><th>60</th></tr></thead>
                    <tbody>
                        <tr><td style="color:#cbd5e1; text-align:left;">Weights of leaves (g)</td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_w0"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_w15"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_w30"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_w45"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_w60"></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left;">Amount of water loss (g)<br><span style="font-size:0.7rem;">(prev wt - new wt)</span></td>
                            <td><input type="number" value="0" readonly class="sim-input"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_l15"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_l30"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_l45"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_l60"></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left;">Rate of water loss (%)<br><span style="font-size:0.7rem;">((prev wt - new wt)/prev) x 100%</span></td>
                            <td><input type="number" value="0" readonly class="sim-input"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_r15"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_r30"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_r45"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="m_r60"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4 style="color: #facc15; font-family: 'Poppins'; margin-bottom: 10px;">b. Sunflower leaves</h4>
            <div class="table-responsive-wrapper" style="margin-bottom: 25px;">
                <table class="sim-table">
                    <thead><tr><th style="width:30%; text-align:left;">Time (minutes)</th><th>0</th><th>15</th><th>30</th><th>45</th><th>60</th></tr></thead>
                    <tbody>
                        <tr><td style="color:#cbd5e1; text-align:left;">Weights of leaves (g)</td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_w0"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_w15"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_w30"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_w45"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_w60"></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left;">Amount of water loss (g)<br><span style="font-size:0.7rem;">(prev wt - new wt)</span></td>
                            <td><input type="number" value="0" readonly class="sim-input"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_l15"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_l30"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_l45"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_l60"></td>
                        </tr>
                        <tr><td style="color:#cbd5e1; text-align:left;">Rate of water loss (%)<br><span style="font-size:0.7rem;">((prev wt - new wt)/prev) x 100%</span></td>
                            <td><input type="number" value="0" readonly class="sim-input"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_r15"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_r30"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_r45"></td>
                            <td><input type="number" step="0.01" class="sim-input" id="s_r60"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">c. Calculate the cumulative percentage of water loss after 30 minutes:</label>
                <textarea class="sim-input" id="rep_cumul_30" rows="3" placeholder="Show working for Mango and Sunflower using the formula from the manual..."></textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">d. Describe your procedure:</label>
                <textarea class="sim-input" id="rep_trans_proc" rows="2" placeholder="Briefly describe hanging and weighing..."></textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">e. Calculate the overall percentage loss of water after 60 minutes:</label>
                <textarea class="sim-input" id="rep_overall_60" rows="3" placeholder="i. Mango leaves: \n\nii. Sunflower leaves:"></textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">g. Which of these plant species is better adapted to the xeromorphic habitat? Justify your answer.</label>
                <textarea class="sim-input" id="rep_xero" rows="3" placeholder="Identify the species and explain morphological adaptations (e.g. cuticles, stomata)..."></textarea>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="color: #38bdf8; font-weight: bold; font-family: 'Poppins'; display: block; margin-bottom: 5px;">i. List the external factors that influence the rate of transpiration:</label>
                <input type="text" class="sim-input" id="rep_factors" placeholder="List environmental factors...">
            </div>

            <p style="color: #ef4444; font-size: 0.8rem; margin-top: 15px;"><i class="fas fa-exclamation-triangle"></i> Note: The requirement to plot two graphs (Part h) is omitted in this digital laboratory.</p>
        </div>
    `;
}