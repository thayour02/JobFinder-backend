const mongoose = require('mongoose')
const User = require("../model/userModel.js")
// const generateVerificationCode = require('../../middleware/generateVerificationCode.js')
const { sendVerificationMail, sendWelcomeEmail, sendResetPasswordMail, sendSuccessResetPasswordMail } = require('../mailtrap/mails.js')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const register = async (req, res, next) => {
    const { firstName, LastName, email, password } = req.body
    try {
        if (!email || !password || !firstName || !LastName) {
            throw new Error("All fields are required");
        }
        //checking existing users
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered', success: false })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        // const verificationToken = generateVerificationCode();

        //generating token using crypto library
        const EmailVerificationToken = crypto.randomBytes(64).toString('hex')
        const EmailVerificationTokenExpireAt = Date.now() + 24 * 60 * 60 * 1000 // 24hours

        //save user 
        const user = await User.create({
            firstName,
            LastName,
            password: hashPassword,
            email,
            EmailVerificationToken,
            EmailVerificationTokenExpireAt
        });

        //create token
        const token = await user.createJWT(res, user._id)
        await sendVerificationMail(user, EmailVerificationToken)
        res.status(201).json({
            success: true,
            message: 'Account Created Successfully',
            user: {
                ...user._doc,
                password: undefined
            },
            token,
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error.message })
    }
}

const verifyMail = async (req, res, next) => {
    const { token,id } = req.params

    try {
        const user = await User.findByIdAndUpdate({_id:id},{EmailVerificationToken:token})
        // EmailVerificationToken:token,
        // EmailVerificationTokenExpireAt: { $gt: Date.now() }
        if (!user) {
            return res.status(400).json({ success: false, message: "invalid or code expired" })
        }
        user.isVerified = true
        user.EmailVerificationToken = undefined
        user.EmailVerificationTokenExpireAt = undefined

        await user.save();

        await sendWelcomeEmail(user.email, user.firstName)

        res.status(201).json({
            success: true,
            message: "email verify successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "server error", error })
    }
}

const logOut = async (req, res, next) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "logged Out successfully" })
}


const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Please provide both email and password')
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'invalid details', success: false })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'invalid details', success: false })
        }
        const token = await user.createJWT(res, user._id)
        user.lastLogin = new Date()
        await user.save();

        res.status(200).json({
            success: true,
            message: "login successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
            token
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error)
    }
}

const forgetPassword = async (req, res, next) => {
    const { email } = req.body

    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'email doesnt exist', success: false })
        }

        const generateResetToken = crypto.randomBytes(20).toString('hex')

        const generateResetTokenExpireDate = Date.now() + 1 * 60 * 60 * 1000; //1hours;
        user.resetPasswordToken = generateResetToken
        user.resetPasswordExpireAt = generateResetTokenExpireDate

        await user.save()

        await sendResetPasswordMail(user)

        res.status(200).json({ success: true, message: `Password Reset Link sent to your email ${user?.email}` })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "fail to reset password" })

    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token,id } = req.params;
        const { password } = req.body;
      
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate({ _id: id }, {password: hashPassword})
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expire reset token" })
        }

        await user.save()
        await sendSuccessResetPasswordMail(user)
        res.status(200).json({
            success: true,
            message: "password reset succefully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
       return res.status(400).json({ success: false, message: "fail to reset password" })
    }
}


module.exports = {
    register, signIn,
    verifyMail,
    logOut, forgetPassword, resetPassword
}