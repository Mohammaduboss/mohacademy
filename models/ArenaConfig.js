const mongoose = require('mongoose');

const ArenaConfigSchema = new mongoose.Schema({
    deadline: { type: Date, required: true }, // When the Arena OPENS
    durationHours: { type: Number, default: 2 }, // How long it stays open (Default: 2 hours)
    title: { type: String, default: "National Grand Prix" },
    subject: { type: String, default: "physics" },
    topic: { type: String, default: "grand_prix" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ArenaConfig', ArenaConfigSchema);