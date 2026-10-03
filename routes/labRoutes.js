const express = require('express');
const router = express.Router();
const Experiment = require('../models/Experiment'); // Your database model
const { evaluateLab } = require('../services/geminiEvaluator'); // Import the AI Service
const Student = require('../models/student');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Helper middleware to check for user tokens on GET requests without blocking guests
const optionalAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            req.student = await Student.findById(decoded.id || decoded.studentId);
        } catch (err) {
            req.student = null;
        }
    }
    next();
};
// GET Route to fetch all experiments for the labs.html dashboard
router.get('/catalog', async (req, res) => {
    try {
        // Fetch all experiments from the database
        const labs = await Experiment.find({});
        res.status(200).json(labs);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Failed to load laboratory catalog" });
    }
});

// GET Route to fetch a single experiment by its experimentCode (e.g., M2:01)
router.get('/:code', optionalAuth, async (req, res) => {
    try {
        const lab = await Experiment.findOne({ experimentCode: req.params.code });
        if (!lab) {
            return res.status(404).json({ message: "Experiment blueprint not found in database." });
        }

        // Check if the lab is PRO-gated and if the visiting student has PRO access
        if (lab.isPremium && (!req.student || !req.student.isPremium)) {
            return res.status(403).json({
                message: "This advanced laboratory simulation requires a MohAcademy PRO subscription.",
                requiresUpgrade: true
            });
        }

        res.status(200).json(lab);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Failed to retrieve the laboratory parameters." });
    }
});

// POST Route to receive student data and trigger grading
router.post('/:code/submit', auth, async (req, res) => {
    try {
        // 1. Fetch the rules for this specific experiment
        const lab = await Experiment.findOne({ experimentCode: req.params.code });
        if (!lab) {
            return res.status(404).json({ message: "Experiment blueprint not found." });
        }

        // --- PRO LAB GATING ---
        const studentId = req.user ? req.user.id : (req.student && req.student.id);
        const student = studentId ? await Student.findById(studentId) : null;

        if (lab.isPremium && (!student || !student.isPremium)) {
            return res.status(403).json({ 
                message: "This advanced laboratory simulation requires a MohAcademy PRO account.",
                requiresUpgrade: true 
            });
        }
        // ----------------------

        // 2. Send student payload and the rules to Gemini
        const evaluationResult = await evaluateLab(req.body, lab);

        // --- GAMIFICATION INJECTION ---
        if (student) {
            student.xpScore = (student.xpScore || 0) + 50;
            student.tasksResolved = (student.tasksResolved || 0) + 1;

            if (!student.unlockedBadges.includes('Lab Explorer')) {
                student.unlockedBadges.push('Lab Explorer');
            }
            await student.save();
        }
        // ------------------------------

        // 3. Send the grade back to the browser
        res.status(200).json(evaluationResult);

    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ message: "Failed to grade the laboratory parameters." });
    }
});

module.exports = router;