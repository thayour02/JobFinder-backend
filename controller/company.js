const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const Company = require('../model/companyModel.js')

// const generateVerificationToken = require('../middleware/generateVerificationCode.js')
const { sendCompanyVerificationMail, sendWelcomeEmail, sendResetPasswordMail, sendSuccessResetPasswordMail } = require('../mailtrap/mails.js')


const register = async (req, res, next) => {
    const { email, name, password, location, contact } = req.body

    if (!email) {
        return res.status(404).send('email is required')
    }
    if (!name) {
        return res.status(404).send('Company Name is required')
    }
    if (!password) {
        return res.status(404).send('password is required')
    }

    try {
        //existing user
        const existingCompany = await Company.findOne({ email })
        if (existingCompany) {
            return res.status(400).json({ message: 'Email is already registered', success: false })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        // const verificationToken = generateVerificationToken()
        const EmailVerificationToken = crypto.randomBytes(64).toString('hex')

        //create new user
        const account = await Company.create({
            name,
            email,
            password: hashPassword,
            location,
            contact,
            EmailVerificationToken,
            EmailVerificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000 //24hrs
        })
        // user token
        const token = await account.createJWT(res, account._id);
        await sendCompanyVerificationMail(account, EmailVerificationToken)
        res.status(201).json({
            success: true,
            message: "Company Account Create Successfully",
            user: {
                ...account._doc,
                password: undefined,
            },
            token,
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

}


const verifyCompanyMail = async (req, res, next) => {
    const {token,id} = req.params
    try {
        const account = await Company.findByIdAndUpdate({ _id: id }, { EmailVerificationToken: token })

        if (!account) {
            return res.status(400).json({ success: false, message: "invalid or expire code" })
        }

            account.isVerified = true,
            account.EmailVerificationToken = undefined,
            account.EmailVerificationTokenExpireAt = undefined

        await account.save()

        await sendWelcomeEmail(account.email, account.name)

        res.status(201).json({
            success: true,
            message: "email verify successfully",
            user: {
                ...account._doc,
                password: undefined
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "server error", error })

    }
}

const logOut = async (req, res, next) => {
    res.clearCookie("token")
    return res.status(200).json({ success: true, message: "logged out successfully" })
}

const forgetPassword = async (req, res, next) => {
    const { email } = req.body

    try {
        const account = await Company.findOne({ email })

        if (!account) {
            return res.status(404).json({ success: false, message: "account not exist" })
        }

        const generateResetToken = crypto.randomBytes(20).toString('hex')
        const generateResetTokenExpireDate = Date.now() + 1 * 60 * 60 * 1000 // 1hrs

        account.resetPasswordToken = generateResetToken
        account.resetPasswordExpireAt = generateResetTokenExpireDate

        await account.save()

        await sendResetPasswordMail(account)
        res.status(200).json({ success: true, message: "Password Reset Link sent to yout email" })
    } catch (error) {
        console.log(error)
    }

}

const resetPassword = async (req, res, next) => {
    const { token } = req.params
    const { password } = req.body

    try {
        const account = await Company.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: { $gt: Date.now() }
        })
        if (!account) {
            return res.status(400).json({ success: false, message: 'invalid or expire link' })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        account.resetPasswordToken = undefined
        account.resetPasswordExpireAt = undefined
        account.password = hashPassword

        await account.save()

        await sendResetPasswordMail(account.email)
        res.status(200).json({
            success: true,
            message: "password reset succefully",
            user: {
                ...account._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const signIn = async (req, res, next) => {
    const { email, password } = req.body
    try {
        //validate email & password
        if (!email || !password) {
            return res.status(404).send('please input your details')
        }

        // check if email is registered
        const company = await Company.findOne({ email })
        if (!company) {
            return res.status(400).json({ message: 'invalid details', success: false })
        }
        // if password is matched
        const isMatch = bcrypt.compare(password, company.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'invalid details', success: false })
        }
        const token = await company.createJWT(res, company._id)

        company.lastLogin = new Date()
        await company.save()


        res.status(201).json({
            success: true,
            message: "Login Successfully",
            user: {
                ...company._doc,
                password: undefined,
            },
            token
        })


    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error.message })
    }
}


const updateCompanyProfile = async (req, res, next) => {
    const { name, email,
        contact, location,
        profileUrl,
        about, url } = req.body
    try {
        //validate
        // if (!name || !email || !contact || !location || profileUrl || jobPost || !about ) {
        //     return res.status(404).send("Please Provide all required fields")
        // }
        //find id from mongoose
        const id = req.body.user.userId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No Company with: ${id}`
            )

        const updateCompanyProfile = {
            name,
            email,
            contact,
            location,
            profileUrl,
            about,
            url,
            _id: id,
        }
        const company = await Company.findByIdAndUpdate(id, updateCompanyProfile, {
            new: true
        })

        const token = company.createJWT()

        company.password = undefined,

            res.status(201).send({
                success: true,
                message: 'Update Successfully',
                company,
                token
            })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params

        const com = await Company.findById(id)
        if (!com) {
            return res.status(404).json({ message: "Company  Not Found" })
        }

        await Company.findByIdAndDelete(id)

        // Delete job posts from Job collection
        await Jobs.deleteMany({ company: id });

        res.status(202).json({
            success: true,
            message: "Job deleted Successfully",
        })


    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}
const getCompanyProfile = async (req, res, next) => {
    try {
        const id = req.body.user.userId
        const company = await Company.findById({ _id: id })

        if (!company)
            return res.status(404).send('No Company found')

        company.password = undefined
        res.status(201).json({
            success: true,
            data: company,
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// get all company
const getCompanies = async (req, res, next) => {
    try {
        const { search, sort, location } = req.query;

        //SEACRCH FILTERS
        const queryObj = {}

        if (search) {
            queryObj.name = { $regex: search, $options: "i" }
        }
        if (location) {
            queryObj.location = { $regex: location, $options: "i" }
        }

        let queryResult = Company.find(queryObj)

        // sort
        if (sort === "Newest") {
            queryResult = queryResult.sort("-createAt")
        }
        if (sort === "Oldest") {
            queryResult = queryResult.sort("createdAt")
        }
        if (sort === "A-Z") {
            queryResult = queryResult.sort("name");
        }
        if (sort === "Z-A") {
            queryResult = queryResult.sort("name")
        }

        //PAGINATION
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        //records count
        const total = await Company.countDocuments(queryResult);
        const numPage = Math.ceil(total / limit)

        queryResult = queryResult.limit(limit * page)

        const company = await queryResult;
        res.status(200).json({
            success: true,
            total,
            page,
            data: company,
            numPage
        })
    } catch (error) {
        res.status(404).json({ message: error.message })

    }
}

const getJoblist = async (req, res, next) => {
    const { search, sort, location } = req.query
    const id = req.body.user.userId
    try {
        const queryObj = {}
        if (search) {
            queryObj.search = { $regrex: search, $option: "i" }
        }

        let sorting;
        if (sort === "Newest") {
            sorting = "-createAt"
        }

        if (sort === "Oldest") {
            sorting = "createdAt"
        }
        if (sort === "A-Z") {
            sorting = "name";
        }
        if (sort === "Z-A") {
            sorting = "name"
        }


        let queryResult = await Company.findById({ _id: id }).populate({
            path: "jobPosts",
            options: { sort: sorting }
        })
        const company = await queryResult;

        res.status(200).json({
            success: true,
            company
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params

        let company = await Company.findById({ _id: id }).populate({
            path: "jobPosts",
            options: {
                sort: "-_id"
            },
        })
        if (!company) {
            return res.status(404).send('Company Not Found')
        }
        company.password = undefined
        res.status(200).json({
            success: true,
            data: company
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


module.exports = {
    register,
    verifyCompanyMail, deleteProfile,
    logOut, forgetPassword, resetPassword, signIn, updateCompanyProfile,
    getCompanyProfile, getCompanies, getJoblist, getCompanyById
}