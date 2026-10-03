const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/studentController');
const auth = require('../middleware/auth'); // Brings in the security bouncer
const PRICING = require('../config/pricing');

// Route: GET /api/student/profile
// Description: Fetch the latest database stats for the dashboard
router.get('/profile', auth, getProfile);

// Route: PUT /api/student/profile
// Description: Save updated settings from the dashboard
router.put('/profile', auth, updateProfile);

router.get('/config/pricing', (req, res) => {
    res.status(200).json(PRICING);
});
module.exports = router;