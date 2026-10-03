const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    // student is no longer strictly required, allowing the Bot to post
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    text: {
        type: String,
        required: true
    },
    // New flags to identify the official MohAcademy AI Bot
    isBot: {
        type: Boolean,
        default: false
    },
    botName: {
        type: String,
        default: 'MOH Assistant'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', CommentSchema);