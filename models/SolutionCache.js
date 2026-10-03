const mongoose = require('mongoose');

const SolutionCacheSchema = new mongoose.Schema({
    questionQuery: { type: String, required: true, unique: true, index: true },
    aiResponse: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SolutionCache', SolutionCacheSchema);