const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a production-ready transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Forces secure SSL/TLS connection
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD // This MUST be a Google App Password
        },
        // Bypasses strict cloud SSL verification hangs
        tls: {
            rejectUnauthorized: false 
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from: `MohAcademy <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;