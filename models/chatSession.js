const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // <-- Changed to false so guests don't crash the server
    },
    messages: [{
        role: { type: String, enum: ['user', 'model'], required: true },
        text: { type: String, required: true },
        hasAttachment: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    attemptCount: {
        type: Number,
        default: 0 // Tracks answers submitted for the current active question (0, 1, or 2)
    },
    currentSubject: {
        type: String,
        enum: ['Chemistry', 'Physics', 'Biology', 'Mathematics', 'Further Mathematics', 'Computer Science', 'General'],
        default: 'General'
    },
    currentTopic: {
        type: String,
        default: 'Unassigned'
    },
    status: {
        type: String,
        enum: ['idle', 'awaiting_attempt_1', 'awaiting_attempt_2'],
        default: 'idle'
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);