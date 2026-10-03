const express = require('express');
const router = express.Router();

// Import all required database models
const Student = require('../models/Student'); 
const Contact = require('../models/Contact');
const Quiz = require('../models/Quiz');
const BlogPost = require('../models/BlogPost');
const ArenaConfig = require('../models/ArenaConfig');

/**
 * GET /api/admin/dashboard
 * Fetches platform analytics, student records, and incoming inquiries
 */
router.get('/dashboard', async (req, res) => {
    try {
        // 1. Run parallel database queries for optimal performance
        const totalStudentsCount = await Student.countDocuments();
        const totalMessagesCount = await Contact.countDocuments();

        // 2. Fetch all student profiles (Sort by newest join date first)
        const studentsList = await Student.find()
            .select('-password')
            .sort({ createdAt: -1 });

        // 3. Fetch all contact submissions to display on your terminal desk
        const recentMessages = await Contact.find()
            .sort({ createdAt: -1 });

        // 4. Send the compiled package straight to the frontend dashboard
        res.status(200).json({
            success: true,
            metrics: {
                totalStudents: totalStudentsCount,
                totalMessages: totalMessagesCount
            },
            students: studentsList,
            messages: recentMessages
        });

    } catch (error) {
        console.error('Admin Tracker System Exception:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to extract cloud infrastructure metrics.' 
        });
    }
});

/**
 * POST /api/admin/quizzes
 * Securely publishes a new GCE science question to the platform database
 */
router.post('/quizzes', async (req, res) => {
    try {
        const { subject, topic, question, options, correctAnswerIndex, xpValue, explanation } = req.body;

        const newQuiz = new Quiz({
            subject,
            topic,
            question,
            options,
            correctAnswerIndex: parseInt(correctAnswerIndex),
            xpValue: parseInt(xpValue) || 25,
            explanation
        });

        await newQuiz.save();
        res.status(201).json({ success: true, message: 'Question successfully published to the live arena!' });
    } catch (error) {
        console.error('Quiz Publication Error:', error);
        res.status(500).json({ success: false, error: 'Failed to write quiz to cloud storage.' });
    }
});

/**
 * POST /api/admin/blogs
 * Publishes news, announcements, or deep-dive science articles to the live feed with optional photos
 */
router.post('/blogs', async (req, res) => {
    try {
        const { title, category, content, image } = req.body;

        const newPost = new BlogPost({
            title,
            category,
            content,
            image // Base64 photo string included here
        });

        await newPost.save();
        res.status(201).json({ success: true, message: 'Article successfully published to the news stream!' });
    } catch (error) {
        console.error('Blog Publication Error:', error);
        res.status(500).json({ success: false, error: 'Failed to upload blog post to database.' });
    }
});

// PUT /api/admin/arena-schedule
router.put('/arena-schedule', async (req, res) => {
    try {
        const { deadline, title, subject, topic } = req.body;

        let config = await ArenaConfig.findOne({ isActive: true });
        if (!config) {
            config = new ArenaConfig({ deadline, title, subject, topic });
        } else {
            config.deadline = deadline;
            if (title) config.title = title;
            if (subject) config.subject = subject;
            if (topic) config.topic = topic;
        }

        await config.save();
        res.status(200).json({ success: true, message: "Arena schedule updated!", config });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to update arena schedule" });
    }
});

module.exports = router;