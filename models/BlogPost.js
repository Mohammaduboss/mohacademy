// models/BlogPost.js
const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "physics", "chemistry", "announcement"
    content: { type: String, required: true },
    image: { type: String, default: "" },       // Stores the converted photo string safely
    author: { type: String, default: "MohAcademy Admin" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);