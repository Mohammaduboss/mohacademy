const mongoose = require('mongoose');

const StudentWeaknessSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['Chemistry', 'Physics', 'Biology', 'Mathematics', 'Further Mathematics', 'Computer Science']
    },
    topic: {
        type: String,
        required: true, // e.g., "Organic Synthesis", "Projectiles", "Integration by Parts"
        trim: true
    },
    incorrectAttemptsCount: {
        type: Number,
        default: 2
    },
    resolved: {
        type: Boolean,
        default: false
    },
    lastAttemptedDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentWeakness', StudentWeaknessSchema);