const Post = require('../models/post');
const Comment = require('../models/comment');
const Student = require('../models/student');
const { GoogleGenAI } = require('@google/genai'); 

// Initialize the AI securely using your existing .env key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Create a new forum post & Trigger Auto-Bot
// @route   POST /api/forum/posts
exports.createPost = async (req, res) => {
    try {
        const { subject, title, content } = req.body;

        const newPost = new Post({
            student: req.student.id, 
            subject,
            title,
            content
        });

        const post = await newPost.save();
        await post.populate('student', 'name xpScore');

        const studentId = req.student ? req.student.id : (req.user && req.user.id);
        if (studentId) {
            await Student.findByIdAndUpdate(studentId, {
                $inc: { xpScore: 10, tasksResolved: 1 }
            });
        }

        // 1. Send success response to student INSTANTLY (No waiting for AI)
        res.status(201).json(post);

        // 2. BACKGROUND PROCESS: The MOH Assistant Auto-Reply
        (async () => {
            try {
                // Formulate a strict prompt ensuring GCE A-Level standards
                const prompt = `You are the official 'MOH Assistant', an expert AI tutor for the Cameroon GCE Advanced Level syllabus. 
                A student has just posted a question in the ${subject} forum.
                Title: "${title}"
                Question Details: "${content}"
                
                Provide a clear, highly accurate, and supportive answer. Structure your response with paragraphs and bullet points if necessary. Do not mention that you are an AI. Speak as the official MohAcademy guide.`;

                // Fetch the response from Gemini
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                // Save the AI's response as an official comment linked to this post
                const botComment = new Comment({
                    post: post._id,
                    isBot: true,
                    botName: 'MOH Assistant (Official Instructor)',
                    text: response.text
                });

                await botComment.save();
                console.log(`[System] MOH Assistant successfully replied to post: ${post._id}`);

            } catch (aiError) {
                console.error('[System] MOH Assistant failed to generate a reply:', aiError);
            }
        })(); // Self-executing background function

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during post creation');
    }
};

// @desc    Get all posts
// @route   GET /api/forum/posts
exports.getAllPosts = async (req, res) => {
    try {
        const { subject } = req.query;
        let query = {};
        if (subject && subject !== 'all') {
            query.subject = subject;
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 }) 
            .populate('student', 'name xpScore'); 

        res.status(200).json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching forum feed');
    }
};

// @desc    Add a comment (Answer/Reply) to a specific post
// @route   POST /api/forum/posts/:postId/comments
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'The original post could not be found.' });

        const newComment = new Comment({
            post: postId,
            student: req.student.id, 
            text
        });

        const comment = await newComment.save();
        await comment.populate('student', 'name xpScore');

        const studentId = req.student ? req.student.id : (req.user && req.user.id);
        if (studentId) {
            const student = await Student.findById(studentId);
            if (student) {
                student.xpScore = (student.xpScore || 0) + 15;
                
                // Count how many comments this student has made in total
                const answerCount = await Comment.countDocuments({ student: studentId });
                
                // Unlock the "Forum Contributor" badge if they hit 5 answers
                if (answerCount >= 5 && !student.unlockedBadges.includes('Forum Contributor')) {
                    student.unlockedBadges.push('Forum Contributor');
                }
                
                await student.save();
            }
        }

        res.status(201).json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error while adding comment');
    }
};

// @desc    Get all comments for a specific post
// @route   GET /api/forum/posts/:postId/comments
exports.getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .sort({ createdAt: 1 }) 
            .populate('student', 'name xpScore');

        res.status(200).json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching comments thread');
    }
};