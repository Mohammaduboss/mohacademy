require('dotenv').config(); // Loads our hidden variables from the .env file
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize the Express app
const app = express();

// ==========================================
// 1. MIDDLEWARE (MUST GO FIRST)
// ==========================================
// This translates the JSON data sent from frontend clients BEFORE it hits your routes
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// ==========================================
// 2. DATABASE CONNECTION
// ==========================================
mongoose.connect(process.env.MONGO_URI, {
    family: 4
})
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });



// Dynamic Pricing Route (Phase 2 Freemium Architecture)
const pricingConfig = require('./config/pricing');
app.get('/api/config/pricing', (req, res) => {
    res.status(200).json(pricingConfig);
});

// Authentication Routes (Signup, Login, etc.)
app.use('/api/auth', require('./routes/authRoutes'));

// Student Profile Routes (Dashboards, Settings updates)
app.use('/api/student', require('./routes/studentRoutes'));

// Community Forum Routes (Posts and Comments)
app.use('/api/forum', require('./routes/forumRoutes'));

// Chatbot AI Routes (MOH Assistant)
app.use('/api/chat', require('./routes/chatRoutes'));

// Contact Form Processing Route
app.use('/api/contact', require('./routes/contactRoutes'));

// Admin Dashboard Routes (Analytics, Student Records, Inquiries)
app.use('/api/admin', require('./routes/adminRoutes'));

// Quiz Routes (Fetch questions, Grade submissions, Award XP/Badges)
app.use('/api/quizzes', require('./routes/quizRoutes'));

// Blog Routes (Public feed for science deep-dives and announcements)
app.use('/api/blogs', require('./routes/blogRoutes'));

// lab routes
app.use('/api/labs', require('./routes/labRoutes'));

// Past Paper PDF Upload Routes
app.use('/api/papers', require('./routes/paperRoutes'));

// Payment Gateway Processing Routes (Phase 4)
app.use('/api/payment', require('./routes/paymentRoutes'));

// ==========================================
// 4. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});