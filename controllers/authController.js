const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new student & send OTP
// @route   POST /api/auth/signup
exports.registerStudent = async (req, res) => {
    try {
        const { name, email, password, subjects } = req.body;

        let student = await Student.findOne({ email });
        if (student) {
            return res.status(400).json({ message: 'A student with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        student = new Student({
            name,
            email,
            password: hashedPassword,
            subjects,
            otp: generatedOTP,
            otpExpire: otpExpiration
        });

        await student.save();

        const emailMessage = `Welcome to MohAcademy, ${name}!\n\nYour GCE A-Level Science student account registration is almost complete.\n\nPlease use the following 6-digit One-Time Password (OTP) to verify your account:\n\n👉 ${generatedOTP}\n\nThis code will expire in 15 minutes.`;

        try {
            await sendEmail({
                email: student.email,
                subject: 'MohAcademy Account Verification Code',
                message: emailMessage
            });

            res.status(201).json({
                success: true,
                message: 'Registration successful! Verification OTP sent to your email.'
            });
        } catch (emailErr) {
            console.error('Email could not be sent:', emailErr);
            student.otp = null;
            student.otpExpire = null;
            await student.save();
            return res.status(500).json({ message: 'Registration completed, but failed to send verification email.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during registration');
    }
};

// @desc    Authenticate/Login a student
// @route   POST /api/auth/login
exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email }).select('+password');
        if (!student) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!student.isVerified) {
            return res.status(401).json({ message: 'Your account is not verified yet. Please check your email for the OTP code.' });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { student: { id: student._id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json({
                message: 'Login successful',
                token,
                student: {
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    subjects: student.subjects,
                    xpScore: student.xpScore
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login');
    }
};

// @desc    Verify Account using 6-Digit OTP
// @route   POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: 'Student account not found' });
        }

        if (student.isVerified) {
            return res.status(400).json({ message: 'Account is already verified' });
        }

        if (!student.otp || student.otp !== otp) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (new Date() > student.otpExpire) {
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        student.isVerified = true;
        student.otp = null;
        student.otpExpire = null;
        await student.save();

        const payload = { student: { id: student._id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json({
                message: 'Account successfully verified! Welcome aboard MohAcademy.',
                token,
                student: {
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    subjects: student.subjects,
                    xpScore: student.xpScore
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during OTP verification');
    }
};

// @desc    Forgot Password - Request reset code
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'No account associated with this email address' });
        }

        // Generate a unique 6-digit password reset code
        const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const resetOtpExpiration = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 mins

        student.resetPasswordOtp = resetOtp;
        student.resetPasswordOtpExpire = resetOtpExpiration;
        await student.save();

        const message = `You requested a password reset for your MohAcademy student account.\n\nPlease use the following 6-digit code to update your password:\n\n👉 ${resetOtp}\n\nThis code will expire in 10 minutes. If you did not make this request, please ignore this email and your password will remain unchanged.`;

        try {
            await sendEmail({
                email: student.email,
                subject: 'MohAcademy Password Reset Request',
                message: message
            });

            res.status(200).json({ success: true, message: 'Password reset code successfully sent to email.' });
        } catch (err) {
            student.resetPasswordOtp = null;
            student.resetPasswordOtpExpire = null;
            await student.save();
            return res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during password recovery request');
    }
};

// @desc    Reset Password using code
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // Validate the recovery code
        if (!student.resetPasswordOtp || student.resetPasswordOtp !== otp) {
            return res.status(400).json({ message: 'Invalid recovery code' });
        }

        // Validate expiration
        if (new Date() > student.resetPasswordOtpExpire) {
            return res.status(400).json({ message: 'Recovery code has expired. Please request a new code.' });
        }

        // Encrypt and update the new password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);

        // Clear password reset tokens out of the database
        student.resetPasswordOtp = null;
        student.resetPasswordOtpExpire = null;
        
        await student.save();

        res.status(200).json({ success: true, message: 'Password updated successfully! You can now log in with your new credentials.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during password reset transaction');
    }
};