const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['Physics', 'Chemistry', 'Biology', 'Mathematics']
    },
    title: {
        type: String,
        required: [true, 'Please add a post title']
    },
    content: {
        type: String,
        required: [true, 'Please add content to your post']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);