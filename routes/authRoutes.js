const express = require('express');
const router = express.Router();
const { 
    registerStudent, 
    loginStudent, 
    verifyOTP, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');

// Route: POST /api/auth/signup
router.post('/signup', registerStudent);

// Route: POST /api/auth/login
router.post('/login', loginStudent);

// Route: POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTP);

// Route: POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// Route: POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

module.exports = router;