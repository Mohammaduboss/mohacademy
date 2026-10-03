const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter (the mail delivery service)
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from: `MohAcademy <${process.env.EMAIL_USERNAME}>`, // Dynamically inserts your real email
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;