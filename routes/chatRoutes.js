const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const upload = require('../config/multer');
const ChatSession = require('../models/ChatSession');
const StudentWeakness = require('../models/studentWeakness');
const SolutionCache = require('../models/SolutionCache');
const Student = require('../models/student');
const PRICING = require('../config/pricing');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        },
    };
}

async function generateWithRetry(model, contentPayload, retries = 3, delay = 1500) {
    try {
        return await model.generateContent(contentPayload);
    } catch (error) {
        if (retries > 0 && (error.status === 503 || error.status === 429)) {
            console.warn(`[Google AI Hub Busy] Auto-retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateWithRetry(model, contentPayload, retries - 1, delay * 2);
        }
        throw error;
    }
}

async function establishSessionIdentity(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.studentId = decoded.id;
        } else {
            req.studentId = null; // Guest user
        }
        next();
    } catch (error) {
        req.studentId = null; // Guest user on token failure
        next();
    }
}

router.post('/', establishSessionIdentity, upload.single('image'), async (req, res) => {
    try {
        const { message } = req.body;
        const studentId = req.studentId;
        // --- 5-MESSAGE DAILY LIMIT CHECK ---
        if (studentId) {
            const student = await Student.findById(studentId);
            if (student && !student.isPremium) {
                const now = Date.now();
                const lastReset = student.lastChatbotReset ? new Date(student.lastChatbotReset).getTime() : 0;
                const ONE_DAY_MS = 24 * 60 * 60 * 1000;

                // Auto-reset daily usage if 24 hours have passed
                if (now - lastReset > ONE_DAY_MS) {
                    student.dailyChatbotUsage = 0;
                    student.lastChatbotReset = now;
                }

                const limit = PRICING.freeChatbotLimit || 5;

                if (student.dailyChatbotUsage >= limit) {
                    return res.status(403).json({
                        reply: `🔒 You have reached your daily limit of ${limit} free AI questions.<br><br><a href="/pricing" style="color: #FFD700; font-weight: bold; text-decoration: underline;">Click here to Upgrade to MohAcademy PRO</a> for unlimited 24/7 AI tutoring!`,
                        limitReached: true,
                        status: 'idle'
                    });
                }

                // Increment counter for free tier user
                student.dailyChatbotUsage += 1;
                await student.save();
            }
        }
        // -----------------------------------

        let session = null;
        
        // Only fetch historical sessions if it is a verified, logged-in student
        if (studentId) {
            session = await ChatSession.findOne({ studentId }).sort({ updatedAt: -1 });
        }

        // If no session exists OR the user is a guest, start a fresh session
        if (!session) {
            session = new ChatSession({ 
                studentId: studentId || undefined, // undefined allows MongoDB to bypass required checks
                messages: [], 
                status: 'idle', 
                attemptCount: 0 
            });
        }

        let promptContents = [];
        
        if (req.file) {
            const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);
            promptContents.push(imagePart);
            session.messages.push({ role: 'user', text: '[Uploaded Image Matrix]', hasAttachment: true });
        }

        if (message) {
            promptContents.push(message);
            session.messages.push({ role: 'user', text: message });
        }

        if (promptContents.length === 0) {
            return res.status(400).json({ error: 'Cannot process an empty execution payload.' });
        }

        let adaptiveDirective = "";
        
        if (session.status === 'idle') {
            if (req.file) {
                // SCENARIO A: Image Uploaded (Two-Attempt Rule)
                adaptiveDirective = `
                    The student has uploaded a new question or assignment file.
                    CRITICAL INSTRUCTION: Analyze the problem carefully. Identify the academic subject and specific sub-topic. 
                    DO NOT reveal the answer, steps, or numerical solution. 
                    Instead, extract and state the target question text, explain the underlying theory or formulas required, and instruct the student to upload their first handwritten attempt.
                    Set your systemic output format to start strictly with: "[METADATA: Subject=... | Topic=...]".
                    Use proper LaTeX enclosed in $$ for display equations and $ for inline equations.
                `;
            } else {
                // SCENARIO B: Text Only (Direct Answer & Diagrams)
                adaptiveDirective = `
                    The student is asking a text-based question. Answer them directly, clearly, and fully.
                    Provide complete step-by-step proofs for math and science questions using proper LaTeX enclosed in $$ for display equations and $ for inline.
                    DIAGRAM INSTRUCTION: If explaining a Physics, Biology, or Chemistry concept that heavily benefits from visual aid (e.g., cell structure, force vectors, electrical circuits), you MUST generate a clean, accurate diagram using valid SVG code. Wrap the code exactly like this: \`\`\`svg [your code here] \`\`\`. Make the SVG responsive (viewBox) and visually clean.
                `;
            }
        } else if (session.status === 'awaiting_attempt_1') {
            adaptiveDirective = `
                The student has submitted their first attempt at the question. Evaluate their logic.
                - If correct: Praise them warmly, explain why it's right, and declare the session solved. Include [SESSION_STATUS: CORRECT] at the very end.
                - If incorrect: Point out the conceptual error gently without providing the explicit numerical answer. Give a targeted hint, and prompt them to submit a second attempt. Include [SESSION_STATUS: WRONG_1] at the very end.
                Use proper LaTeX for math.
            `;
        } else if (session.status === 'awaiting_attempt_2') {
            adaptiveDirective = `
                The student has submitted their second attempt. Evaluate their work carefully.
                - If correct: Celebrate their progress and explain why it's right. Include [SESSION_STATUS: CORRECT] at the very end.
                - If incorrect: Provide the full, step-by-step model marking scheme solution using proper LaTeX. Include [SESSION_STATUS: FAIL_FINAL] along with the Subject and Topic at the very end.
            `;
        }

        let normalizedQuery = "";
        if (session.status === 'idle' && !req.file && message) {
            normalizedQuery = message.trim().toLowerCase();
            const cachedSolution = await SolutionCache.findOne({ questionQuery: normalizedQuery });
            
            if (cachedSolution) {
                session.messages.push({ role: 'model', text: cachedSolution.aiResponse });
                await session.save();
                return res.status(200).json({ 
                    reply: cachedSolution.aiResponse, 
                    status: session.status, 
                    attempts: session.attemptCount 
                });
            }
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: `
                You are MOH, an elite academic AI assistant exclusively built for MohAcademy. Your sole purpose is to guide students through the Cameroon GCE Advanced Level science curriculum. 
                
                CRITICAL RULES:
                1. YOU MUST NEVER reference Cambridge, Edexcel, AQA, or any other international syllabus. Treat the Cameroon GCE as the absolute standard.
                2. Use these official Cameroon GCE Subject Codes: Biology (710), Chemistry (715), Pure Mathematics with Mechanics (765), Further Mathematics (775), Physics (780), and Computer Science (795).
                3. If a student asks for past papers, NEVER provide external web links. Instead, tell them to check the "MohAcademy Past Paper Vault" available directly on this platform.
                
                FORMATTING:
                Always format mathematical expressions in LaTeX. Use Markdown for structuring.
                ${adaptiveDirective}
            `
        });

        const result = await generateWithRetry(model, promptContents);
        const response = await result.response;
        let aiText = response.text();

        // Process hidden state flags
        if (session.status === 'idle' && req.file && aiText.includes('[METADATA:')) {
            const metaMatch = aiText.match(/\[METADATA:\s*Subject=(.*?)\s*\|\s*Topic=(.*?)\]/);
            if (metaMatch) {
                session.currentSubject = metaMatch[1];
                session.currentTopic = metaMatch[2];
            }
            aiText = aiText.replace(/\[METADATA:.*?\]/, '').trim();
            session.status = 'awaiting_attempt_1';
            session.attemptCount = 0;
        } else if (aiText.includes('[SESSION_STATUS:')) {
            if (aiText.includes('CORRECT')) {
                session.status = 'idle';
                session.attemptCount = 0;
            } else if (aiText.includes('WRONG_1')) {
                session.status = 'awaiting_attempt_2';
                session.attemptCount = 1;
            } else if (aiText.includes('FAIL_FINAL')) {
                // Only log a weakness if it is an actual logged-in student (not null)
                if (studentId) {
                    await StudentWeakness.create({
                        studentId,
                        subject: session.currentSubject !== 'General' ? session.currentSubject : 'Mathematics',
                        topic: session.currentTopic !== 'Unassigned' ? session.currentTopic : 'General Problem Solving'
                    });
                }
                session.status = 'idle';
                session.attemptCount = 0;
            }
            aiText = aiText.replace(/\[SESSION_STATUS:.*?\]/, '').trim();
        }

        if (session.status === 'idle' && !req.file && message && normalizedQuery) {
            await SolutionCache.create({
                questionQuery: normalizedQuery,
                aiResponse: aiText
            }).catch(() => {}); // Fails silently if another student already triggered the save
        }

        session.messages.push({ role: 'model', text: aiText });
        await session.save();

        res.status(200).json({ reply: aiText, status: session.status, attempts: session.attemptCount });

    } catch (error) {
        console.error('MOH Core Evaluation Failure:', error);
        res.status(500).json({
            reply: 'I encountered an issue processing your submission. Please try sending your work again.',
            error: error.message
        });
    }
});

module.exports = router;