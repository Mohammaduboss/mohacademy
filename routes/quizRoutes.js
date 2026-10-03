const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Student = require('../models/Student');
const auth = require('../middleware/auth'); // Your existing auth middleware
const ArenaConfig = require('../models/ArenaConfig');

// 0. GET UNIQUE TOPICS FOR A SUBJECT
router.get('/topics/:subject', auth, async (req, res) => {
    try {
        // Asks MongoDB to list all distinct 'topic' names where the subject matches
        const topics = await Quiz.distinct('topic', { subject: req.params.subject });
        res.status(200).json(topics);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
});

// 1. GET QUIZZES (Securely fetch questions without answers)
router.get('/:subject/:topic', auth, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ 
            subject: req.params.subject, 
            topic: req.params.topic 
        }).select('-correctAnswerIndex'); // Hides the answer from the frontend!

        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
});

// 2. GRADE QUIZ & AWARD XP/BADGES
router.post('/grade', auth, async (req, res) => {
    try {
        const { topic, subject, userSelections } = req.body;
        
        // Fetch the full quiz data (including answers) from DB
        const actualQuizzes = await Quiz.find({ subject, topic });
        
        let earnedXP = 0;
        let correctCount = 0;
        const totalQuestions = actualQuizzes.length;

        // Grade the submission
        actualQuizzes.forEach((quiz, index) => {
            if (userSelections[index] === quiz.correctAnswerIndex) {
                earnedXP += quiz.xpValue;
                correctCount++;
            }
        });

        // Find the student in the database
        const studentId = req.user ? req.user.id : req.student.id;
        const student = await Student.findById(studentId);
        
        // Update XP & Dashboard Metrics
        student.xpScore = (student.xpScore || 0) + earnedXP;
        student.totalQuizQuestions = (student.totalQuizQuestions || 0) + totalQuestions;
        student.correctQuizAnswers = (student.correctQuizAnswers || 0) + correctCount;
        student.tasksResolved = (student.tasksResolved || 0) + 1;

        // BADGE UNLOCK LOGIC (The Gamification Engine)
        const newBadges = [];
        const accuracy = (correctCount / totalQuestions) * 100;

        // Condition 1: Perfect Score Badge
        if (accuracy === 100 && !student.unlockedBadges.includes('Perfect Scholar')) {
            student.unlockedBadges.push('Perfect Scholar');
            newBadges.push('Perfect Scholar');
        }

        // Condition 2: High XP Benchmark
        if (student.xpScore >= 1000 && !student.unlockedBadges.includes('Quantum Pioneer')) {
            student.unlockedBadges.push('Quantum Pioneer');
            newBadges.push('Quantum Pioneer');
        }

        await student.save();

        // Send the final results and explanations back to the frontend to show the review screen
        res.status(200).json({
            success: true,
            earnedXP,
            correctCount,
            totalQuestions,
            newlyUnlockedBadges: newBadges,
            reviewData: actualQuizzes // Sends the explanations back so they can read why they got it wrong
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Grading engine failed' });
    }
});

// GET /api/quizzes/arena-schedule
router.get('/arena-schedule', async (req, res) => {
    try {
        const config = await ArenaConfig.findOne({ isActive: true }).sort({ updatedAt: -1 });
        res.status(200).json(config || { deadline: null });
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve arena schedule" });
    }
});
module.exports = router;