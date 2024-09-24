// const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require('../mailtrap/mailTemplate.js')
const { client, sender } = require('../mailtrap/mailtrap.js')
const { createMailTransport } = require('./createTransporter.js')
const crypto = require('crypto')
require("dotenv").config()



const sendVerificationMail = (user) => {
    const transporter = createMailTransport()
    const EmailVerificationToken = crypto.randomBytes(64).toString('hex')

    const mailOptions = {
        from: `"Job-Finder" <tayoapp1990@gmail.com>`,
        to: user?.email,
        subject: "verify your mail",
        html: `<p>verify your email address to complete the registration and login into your account.</p>
         <p>This link<h2>expires in 5 min</h2>.</p>
         <p> <a href=${process.env.CLIENT_URL}/verify-email/${user._id}/${EmailVerificationToken}>click here</a></p>`
    }
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
        }else{
            console.log("Verification email sent")
        }
    })
  
}



const sendWelcomeEmail = async (email, name) => {

   try {
    const transporter = createMailTransport()
    const mailOptions = {
        from: `"Job-Finder" <tayoapp1990@gmail.com>`,
        to: user?.email,
        subject: "verify your mail",
        html: `<p>Welcome 👍 ${user?.name} Your account has been created successfully 👋 `,    
    }
    transporter.sendEmail(mailOptions,(error,info)=>{
        if(error){
            console.log(error)
        }else{
            console.log("welcome mail sent")
        }
    })
   } catch (error) {
    
   }
}


const sendResetPasswordMail = async (user) => {
    const generateResetToken = crypto.randomBytes(20).toString('hex');
    const transporter = createMailTransport()
    const mailOptions = {
        from: `"Job-Finder" <tayoapp1990@gmail.com>`,
        to: user?.email,
        subject: "reset Password",
        html:  `<p>Reset your password: 
        <a href="${process.env.CLIENT_URL}/reset-password/${user._id}/${generateResetToken}" target="_blank">Click here</a></p> `,
  
    }
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
        }else{
            console.log("Verification email sent")
        }
    })
}


const sendSuccessResetPasswordMail = async (user) => {
    const transporter = createMailTransport()
    const mailOptions = {
        from: `"Job-Finder" <tayoapp1990@gmail.com>`,
        to: user?.email,
        subject: "reset Password",
        html: `You have reset password successfully`
    }
    console.log(mailOptions)
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
        }else{
            console.log("Verification email sent")
        }
    })
}
module.exports = { sendVerificationMail, sendResetPasswordMail,sendSuccessResetPasswordMail,  sendWelcomeEmail,sendSuccessResetPasswordMail}