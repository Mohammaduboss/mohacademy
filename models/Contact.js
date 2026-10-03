const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    subject: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'Unread',
        enum: ['Unread', 'Read', 'Replied'] // Helps you track what you have already handled
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Contact', ContactSchema);