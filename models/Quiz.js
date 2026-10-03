const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    subject: { type: String, required: true }, // e.g., "physics"
    topic: { type: String, required: true },   // e.g., "mechanics"
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswerIndex: { type: Number, required: true }, // 0, 1, 2, or 3
    xpValue: { type: Number, default: 25 },
    explanation: { type: String, required: true }
});

module.exports = mongoose.model('Quiz', QuizSchema);