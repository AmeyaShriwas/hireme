const nodemailer = require('nodemailer')
require('dotenv').config();


const transporter = nodemailer.createTestAccount({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

const sendOTPToMail = async(receiptMail, otp)=> {
     const mailOptions = {
        from: process.env.EMAIL,
        to: receiptMail,
        subject: 'Your OTP for Password Reset',
        html:  `<h3>Your OTP is:</h3>
        <p><strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>`
     }

     try{
        const info = await transporter.sendMail(mailOptions);
        console.log('email sent', info.response)
        return true
     }
     catch(error){
        console.log('error', error)
        return false
     }
}

module.exports = {sendOTPToMail}