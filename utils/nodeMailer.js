const nodemailer = require('nodemailer');
require('dotenv').config();

// Secret keys for JWT
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;



// Create a transporter object using the environment variables
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // This disables certificate validation
  }
});

// Function to send OTP to the user's email
const sendOTPToMail = async (recipientEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: recipientEmail,
    subject: 'Your OTP for Password Reset',
    html: `
      <h3>Your OTP is:</h3>
      <p><strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true; // Return true if the email was sent successfully
  } catch (error) {
    console.log('Error sending email:', error);
    return false; // Return false if there was an error sending the email
  }
};

module.exports = { sendOTPToMail };
