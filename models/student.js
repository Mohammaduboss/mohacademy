const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email address'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    subjects: {
        type: [String],
        required: true,
        enum: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
        default: []
    },
    xpScore: {
        type: Number,
        default: 0
    },
    unlockedBadges: {
        type: [String],
        default: [] 
    },
    tasksResolved: {
        type: Number,
        default: 0
    },
    totalQuizQuestions: {
        type: Number,
        default: 0
    },
    correctQuizAnswers: {
        type: Number,
        default: 0
    },
    activeStreak: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpire: {
        type: Date,
        default: null
    },
    resetPasswordOtp: {
        type: String,
        default: null
    },
    resetPasswordOtpExpire: {
        type: Date,
        default: null
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    dailyChatbotUsage: {
        type: Number,
        default: 0
    },
    lastChatbotReset: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', StudentSchema);