const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, addComment, getPostComments } = require('../controllers/forumController');
const auth = require('../middleware/auth'); 

// WRITE (Protected): Create a new question
router.post('/posts', auth, createPost);

// READ (Public): View the feed (Anyone can read)
router.get('/posts', getAllPosts);

// WRITE (Protected): Reply to a question
router.post('/posts/:postId/comments', auth, addComment);

// READ (Public): Load replies
router.get('/posts/:postId/comments', getPostComments);

module.exports = router;