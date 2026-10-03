const multer = require('multer');
const path = require('path');

// Configure temporary memory storage to process image buffers directly
const storage = multer.memoryStorage();

// Strict filtering engine to allow only scientific worksheets or problem images
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp/;
    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedExtensions.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    }
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WEBP images are allowed!'));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
    fileFilter: fileFilter
});

module.exports = upload;