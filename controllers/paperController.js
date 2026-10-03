const PastPaper = require('../models/PastPaper');

exports.uploadPaper = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No PDF files were uploaded." });
        }

        let subjects = Array.isArray(req.body.subjects) ? req.body.subjects : [req.body.subjects];
        let years = Array.isArray(req.body.years) ? req.body.years : [req.body.years];
        let paperTypes = Array.isArray(req.body.paperTypes) ? req.body.paperTypes : [req.body.paperTypes];
        let isPremium = Array.isArray(req.body.isPremium) ? req.body.isPremium : [req.body.isPremium];

        const savePromises = req.files.map((file, index) => {
            const newPaper = new PastPaper({
                subject: subjects[index],
                year: years[index],
                paperType: paperTypes[index], 
                isPremium: isPremium[index] === 'true', // Converts the string from FormData to a true Boolean
                pdfUrl: file.path 
            });
            return newPaper.save();
        });

        await Promise.all(savePromises);

        res.status(201).json({ message: `Successfully uploaded ${req.files.length} papers to the vault!` });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to upload the papers to the database." });
    }
};

// ==========================================
// Fetch all papers for the frontend
// ==========================================
// ==========================================
// Fetch all papers for the frontend with paywall logic
// ==========================================
exports.getAllPapers = async (req, res) => {
    try {
        const papers = await PastPaper.find().sort({ uploadedAt: -1 });
        
        // Check if user token passed premium validation
        const isUserPremium = req.user && req.user.isPremium;

        const processedPapers = papers.map(paper => {
            const paperData = paper.toObject();
            
            // Hide solution download URLs for non-premium users on marking schemes
            if (paperData.paperType === 'marking_scheme' && !isUserPremium) {
                paperData.pdfUrl = null; 
                paperData.requiresUpgrade = true;
            }
            return paperData;
        });

        res.status(200).json({ success: true, papers: processedPapers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch papers from the database." });
    }
};