const express = require('express');
const router = express.Router();
const uploadPdf = require('../config/pdfUploader');
const paperController = require('../controllers/paperController');

// POST route to upload a paper
router.post('/upload', uploadPdf.array('pdfFiles', 10), paperController.uploadPaper);

// GET route to fetch all papers for the frontend grid
router.get('/', paperController.getAllPapers);

module.exports = router;