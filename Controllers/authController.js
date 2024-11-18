const authServices = require('./../Services/authServices');
const User = require('./../Models/User'); // Assuming you use Mongoose to manage users


exports.signup = async (req, res) => {
    try {
        const result = await authServices.signup(req.body);
        res.status(201).json({ message: 'User registered successfully', data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await authServices.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const result = await authServices.forgotPassword(req.body);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const result = await authServices.verifyOTP(req.body);
        res.status(200).json({ message: 'OTP verified successfully', data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const result = await authServices.refreshToken(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const result = await authServices.updatePassword(req.body);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fetch Permissions Controller
exports.getPermissions = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the decoded token (middleware should decode the token)
        
        // Fetch user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user's permissions
        return res.status(200).json({ permissions: user.permissions });
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};