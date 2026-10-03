const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// Configure the email delivery transporter using your exact .env variables
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USERNAME, // Matches your .env
        pass: process.env.EMAIL_PASSWORD  // Matches your .env
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // 1. Basic Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Please fill in all required fields.' });
        }

        // 2. Save a secure backup copy to MongoDB Atlas
        const newContactMessage = new Contact({
            name,
            email,
            subject,
            message
        });
        await newContactMessage.save();

        // 3. Construct the HTML email notification
        const mailOptions = {
            from: process.env.EMAIL_USERNAME, // Matches your .env
            to: process.env.EMAIL_USERNAME,   // Matches your .env
            replyTo: email,
            subject: `[MohAcademy Support] ${subject}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <div style="background: linear-gradient(135deg, #8a2be2 0%, #4a00e0 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: #ffffff;">
                        <h1 style="margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.5px;">MohAcademy Support Hub</h1>
                        <p style="margin: 5px 0 0 0; opacity: 0.85; font-size: 0.9rem;">New Student Inquiry Dispatched</p>
                    </div>
                    
                    <div style="padding: 20px; color: #2c3e50; line-height: 1.6;">
                        <p style="margin: 0 0 10px 0;"><strong style="color: #4a00e0;">Student Name:</strong> ${name}</p>
                        <p style="margin: 0 0 10px 0;"><strong style="color: #4a00e0;">Return Email Address:</strong> ${email}</p>
                        <p style="margin: 0 0 20px 0;"><strong style="color: #4a00e0;">Subject Line:</strong> ${subject}</p>
                        
                        <div style="background-color: #f8fafc; border-left: 4px solid #8a2be2; padding: 15px; border-radius: 4px; margin-top: 10px;">
                            <p style="margin: 0; font-style: italic; white-space: pre-wrap; color: #334155;">"${message}"</p>
                        </div>
                    </div>
                    
                    <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; color: #94a3b8; font-size: 0.78rem;">
                        <p style="margin: 0;">This transmission was authenticated and logged securely into the MohAcademy cloud infrastructure.</p>
                    </div>
                </div>
            `
        };

        // 4. Dispatch the email
        await transporter.sendMail(mailOptions);

        // 5. Return success feedback
        res.status(201).json({ success: 'Your message has been sent successfully! The MohAcademy team will respond shortly.' });

    } catch (error) {
        console.error('Contact Form Routing Incident:', error);
        res.status(500).json({ error: 'Server validation error. Could not dispatch the message.' });
    }
});

module.exports = router;