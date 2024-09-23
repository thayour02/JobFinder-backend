const mongoose = require('mongoose')
const User = require('../model/userModel.js')
const Application = require('../model/applicationModel.js')
const Jobs = require('../model/jobModel.js')
const { application } = require('express')

const updateUser = async (req, res, next) => {
    const { firstName,
        LastName,
        email,
        contact,
        location,
        profileUrl,
        jobTitle,
        userCv,
        about,
        twitter,
        facebook,
        linkedin,
        portfolio,
        github,
    } = req.body
    try {
        const userId = req.body.user.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).send(`No user with ${userId}`)
        }

        const user = await User.findById(userId);
        user.socialMedia = { twitter, facebook, linkedin, portfolio, github };
        const error = user.validateSync();
        if (error) {
            return res.status(400).json({ message: error.errors.socialMedia.message });
        }

        const update = {
            firstName,
            LastName,
            email,
            contact,
            location,
            profileUrl,
            jobTitle,
            about,
            userCv,
            socialMedia: { twitter, facebook, linkedin, portfolio, github },
            _id: userId
        }
        const updateUser = await User.findByIdAndUpdate(userId, update, { new: true });
        const token = updateUser.createJWT()
        updateUser.password = undefined

        res.status(200).json({
            success: true,
            message: "updated succefully",
            user: updateUser,
            token
        })
    } catch (error) {
        return res.status(401).json({ message: error.message })
    }
}
const getUsers = async (req, res, next) => {
    try {
        const { search, sort, location } = req.query;

        //SEACRCH FILTERS
        const queryObj = {}

        if (search) {
            // queryObj.firstName = { $regex: search, $options: "i" }
            queryObj.jobTitle = { $regex: search, $options: "i" }
        }
        if (location) {
            queryObj.location = { $regex: location, $options: "i" }
        }

        let queryResult = User.find(queryObj)

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
        const total = await User.countDocuments(queryResult);
        const numPage = Math.ceil(total / limit)

        queryResult = queryResult.limit(limit * page)

        const user = await queryResult;
        res.status(200).json({
            success: true,
            total,
            page,
            data: user,
            numPage
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById({ _id: id }).populate('application').populate('application.job');// Populate applications && // Populate job within applications

        if (!user) {
            return res.status(404).send({
                message: "no user found",
                success: false
            })
        }
        user.password = undefined
        res.status(200).send({
            success: true,
            data: user
        })

    } catch (error) {
        return res.status(401).json({ message: error.message })
    }
}

const getUserProfile = async (req, res) => {
    try {
        const id = req.body.user.userId
        const user = await User.findById({ _id: id })
            .populate({
                path: 'application',
                select: 'job status appliedAt',
                populate: [
                    {
                        path: 'job',
                        populate: {
                            path: "company",
                            select: 'name email profileUrl'
                        }
                    }
                ]
            });
        if (!user) {
            return res.status(404).send(`user not found`)
        }
        user.password = undefined
        res.status(200).send({
            success: true,
            data: user
        })
    } catch (error) {
        return res.status(401).json({ message: error.message })
    }
}

const deleteUser = async (req, res) => {
    const id = req.body.user.userId
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send('user not found')
        }
        await User.findByIdAndDelete(id)

        const app = await Application.deleteMany({ user: id });

        const job = await Jobs.find({ application: id });
        job.forEach((job) => {
            job.application.pull(id);
            job.save();
        });

        return res.status(201).json({ message: "Account deleted successfully...loging out..." })

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getAlljobAppliedFor = async (req, res) => {
    try {
        const id = req.body.user.userId;
        const applications = await Application.findOne({ _id: id }).populate('job').populate("company"); // Populate user details
        return res.status(200).send({
            success: true,
            data: applications
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: ("An error occurred", error.message)
        });
    }
}

module.exports = { getUserById, updateUser, getUsers, getUserProfile, deleteUser, getAlljobAppliedFor }
