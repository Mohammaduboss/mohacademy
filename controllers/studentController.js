const Student = require('../models/student');

const bcrypt = require('bcryptjs');

// @desc    Get current student's fresh profile data (XP, Badges, etc.)
// @route   GET /api/student/profile
exports.getProfile = async (req, res) => {
    try {
        // req.student.id comes from our auth middleware (the bouncer)
        const student = await Student.findById(req.student.id);
        
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        res.status(200).json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching profile');
    }
};

// @desc    Update student settings (Name, Password)
// @route   PUT /api/student/profile
exports.updateProfile = async (req, res) => {
    try {
        // We include .select('+password') just in case we need to verify old passwords later
        const student = await Student.findById(req.student.id).select('+password');
        
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // 1. Update Name if provided
        if (req.body.name) {
            student.name = req.body.name;
        }

        // 2. Encrypt and Update Password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(req.body.password, salt);
        }

        await student.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully in the database!',
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                subjects: student.subjects,
                xpScore: student.xpScore
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error updating profile');
    }
};