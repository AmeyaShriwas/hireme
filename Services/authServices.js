const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../Models/User'); // Assuming you have a User model
require('dotenv').config(); // Load environment variables from .env file
const Transporter = require('./../utils/nodeMailer');




// Secret keys for JWT
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Helper function to generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  };


  // Send OTP Email
const sendOtpEmail = async(email, otp) => {
    
    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your One Time Password (OTP) Code',
      text: `Dear User, Your One-Time-Password (OTP) code for account verification is: ${otp}\n\nThis OTP is valid for the next 5 minutes. Please use it to complete the verification process.\n\nIf you didn't request this OTP, please ignore this email.\n\nBest regards,\nAmeya Shriwas`
    };
    await Transporter.sendMail(mailOption);
  };

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
  try {
    // Step 1: Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      throw new Error('User not found.');
    }

    // Step 2: Generate OTP
    const otp = generateOTP(); // Ensure this function exists and is implemented properly
    console.log(`Generated OTP for ${email}: ${otp}`);

    // Step 3: Send the OTP to the user's email
    try {
      await sendOtpEmail(user.email, otp);
        // Step 4: Save OTP and expiration time in the user's record
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();
    console.log(`OTP saved to user record for ${email}.`);
     return 'otp send to email successfully'
    } catch (error) {
      console.error(`Failed to send OTP to ${email}:`, error.message);
      throw new Error('Failed to send OTP. Please try again later.');
    }

  

  } catch (error) {
    console.error(`Error in forgotPassword: ${error.message}`);
    throw error;
  }
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
