// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

/**
 * GET /api/blogs
 * Public feed to retrieve all science deep-dives and announcements
 */
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let queryFilter = {};

        // If a student filters by a specific subject stream
        if (category && category !== 'all') {
            queryFilter.category = category;
        }

        const articles = await BlogPost.find(queryFilter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, articles });
    } catch (error) {
        console.error('Public Blog Fetch Error:', error);
        res.status(500).json({ success: false, error: 'Failed to stream latest articles.' });
    }
});

module.exports = router;