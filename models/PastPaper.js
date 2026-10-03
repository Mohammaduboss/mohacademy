const mongoose = require('mongoose');

const pastPaperSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    year: { type: String, required: true },
    paperType: { type: String, required: true },
    isPremium: { type: Boolean, default: false }, // NEW: Identifies Marking Schemes
    pdfUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PastPaper', pastPaperSchema);