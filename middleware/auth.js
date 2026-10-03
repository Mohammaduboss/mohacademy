const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Get the token from the header of the incoming request
    const token = req.header('x-auth-token');

    // 2. Check if no token was provided
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied. Please log in.' });
    }

    // 3. Verify the token is real and hasn't been tampered with
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the student's ID payload to the request so we know exactly who is asking
        req.student = decoded.student;
        
        // Move on to the actual route (let them in)
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};