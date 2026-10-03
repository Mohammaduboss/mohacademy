const mongoose = require('mongoose');

const LabSubmissionSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },
    experiment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Experiment', 
        required: true 
    },
    
    // The raw data the student typed in (tables, graphs, text reports)
    studentPayload: { type: mongoose.Schema.Types.Mixed, required: true },
    
    // The structured feedback returned by the Gemini AI API
    aiEvaluation: {
        totalScore: { type: Number, required: true },
        maxScore: { type: Number, required: true },
        breakdown: { type: mongoose.Schema.Types.Mixed },
        feedbackText: { type: mongoose.Schema.Types.Mixed }
    },
    
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LabSubmission', LabSubmissionSchema);