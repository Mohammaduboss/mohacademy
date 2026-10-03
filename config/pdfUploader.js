const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Authenticate with your .env credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure the Cloudinary storage engine for PDFs
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'MohAcademy_PastPapers',
        resource_type: 'auto',
        allowed_formats: ['pdf']
    },
});

const uploadPdf = multer({ storage: storage });
module.exports = uploadPdf;