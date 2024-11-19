const {sendOTPToMail}  = require('./nodeMailer')

exports.sendOTP = (email) => {
    // Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Simulate sending OTP (in real-world apps, use email services like SendGrid, SES, etc.)
    console.log(`Sending OTP ${otp} to ${email}`);
    

    return otp; // Return OTP for storing in the database
};

exports.verifyOTP = (userOtp, storedOtp) => {
    return userOtp === storedOtp;
};
