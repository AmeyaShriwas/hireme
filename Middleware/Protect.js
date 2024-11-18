const jwt = require('jsonwebtoken')
require('dotenv').config(); // Load environment variables from .env file



exports.protect = (req, res, next) => {
    console.log('req', req.headers.authorization)
    try {
        const token = req.headers.authorization // Extract token from Authorization header
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; // Attach decoded token data to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
