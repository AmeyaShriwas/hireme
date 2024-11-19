const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../Models/User'); // Assuming you have a User model
const { sendOTP, verifyOTP } = require('./../utils/otpUtils'); // OTP-related logic
require('dotenv').config(); // Load environment variables from .env file
const {sendOTPToMail}  = require('./../utils/nodeMailer')



// Secret keys for JWT
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.signup = async ({ userName, email, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email is already registered.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword, role });
    await newUser.save();

    return { userName, email, role };
};

exports.login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid email or password.');

    console.log('access token', ACCESS_TOKEN_SECRET)
    console.log('REFERESH TOKEN', REFRESH_TOKEN_SECRET)
    // Generate tokens
    const accessToken = jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

exports.forgotPassword = async ({ email }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found.');

    const otp = sendOTP(email); // Utility to send OTP
    const response = await sendOTPToMail(email, otp)
    console.log('response from mail', response)
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    return 'OTP sent to your email.';
};

exports.verifyOTP = async ({ email, otp }) => {
    const user = await User.findOne({ email });
    if (!user || !user.otp || user.otpExpiresAt < Date.now()) throw new Error('OTP is invalid or has expired.');

    if (user.otp !== otp) throw new Error('Invalid OTP.');

    // Clear OTP fields after verification
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return { email };
};

exports.refreshToken = async ({ refreshToken }) => {
    if (!refreshToken) throw new Error('Refresh token is required.');

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        return { accessToken: newAccessToken };
    } catch (error) {
        throw new Error('Invalid refresh token.');
    }
};

exports.updatePassword = async ({ email, newPassword }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found.');


    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return 'Password updated successfully.';
};
