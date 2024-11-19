const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using the environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider (e.g., 'gmail', 'outlook', etc.)
  auth: {
    user: process.env.EMAIL,    // Email address from .env file
    pass: process.env.PASSWORD  // Email password or app-specific password from .env file
  }
});

// Function to send OTP to the user's email
const sendOTPToMail = async (recipientEmail, otp) => {
  // Define the email options (subject, body, etc.)
  const mailOptions = {
    from: process.env.EMAIL,  // Sender's email
    to: recipientEmail,       // Recipient's email
    subject: 'Your OTP for Password Reset',  // Subject of the email
    html: `
      <h3>Your OTP is:</h3>
      <p><strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    ` // HTML content of the email
  };

  try {
    // Send the email using the transporter
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true; // Return true if the email was sent successfully
  } catch (error) {
    console.log('Error sending email:', error);
    return false; // Return false if there was an error sending the email
  }
};

module.exports = { sendOTPToMail };
