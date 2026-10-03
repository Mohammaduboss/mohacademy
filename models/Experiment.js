const mongoose = require('mongoose');

const ExperimentSchema = new mongoose.Schema({
    experimentCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    xpReward: { type: Number, default: 50 },
    instructions: [{ type: String }],
    isPremium: { type: Boolean, required: true, default: false },
    
    // NEW: Telling the database to accept our Virtual Canvas and Grading settings
    simulationSettings: { type: Object, default: {} },
    gradingRubric: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Experiment', ExperimentSchema);