const express = require('express');
const router = express.Router();
const authController = require('./../Controllers/authController');
const protect  = require('./../Middleware/Protect')

// Routes for authentication
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/refresh-token', authController.refreshToken);
router.post('/auth/update-password', authController.updatePassword);
router.get('/auth/permissions', protect.protect, authController.getPermissions);


module.exports = router;
