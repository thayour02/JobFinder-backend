const mongoose = require('mongoose')
const Application = require('../model/applicationModel')
const Jobs = require('../model/jobModel')
const User = require('../model/userModel')
const Company = require('../model/companyModel')

const apply = async (req, res) => {
    try {
        const { resume, coverLetter, appliedAt } = req.body
        const userId = req.params.userId
        const jobId = req.params.jobId

        // if user already apply for a job
        const alreadyApply = await Application.findOne({ user: userId, job: jobId })
        if (alreadyApply) {
            return res.status(400).json({
                success: false,
                message: "User already apply for this job"
            })
        }

        // find if job is available for application
        const job = await Jobs.findById(jobId)
        if (!job) {
            return res.status(404).send({
                success: false,
                message: "Jobs Not Found"
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found....Create a seeker account to apply for job"
            })
        }
        if (user.accountType !== "Seeker") {
            return res.status(401).json({
                success: false,
                message: "Your account cannot apply for a job"
            })
        }

        const application = new Application({
            user: { ...user._doc },
            job: job._id,
            appliedAt: new Date()
        });
        await application.save();


        const users = await User.findByIdAndUpdate(req.params.userId, {
            $push: { application: application._id }
        }, { new: true }).populate("application job")
        const jobs = await Jobs.findByIdAndUpdate(req.params.jobId, {
            $push: { application: application._id }
        }, { new: true })

        //   Create notification for the company

        //  const jobb = await Jobs.findById(jobId).populate('company');
        //  const comp = job.company;

        //  const companyNotification = new Notification({
        //      user: comp._id,
        //      message: `New application received for job: ${jobTitle}`
        //  });

        //  await companyNotification.save();

        return res.status(200).send({
            sucess: true,
            message: "Application Successful",
            data: application
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}


const getApplicationDetails = async (req, res) => {
    try {
        const applicationId = req.params.id; //  get the application ID from the request parameters url
        const application = await Application.findById(applicationId)
            .populate('user') // Populate user details, specify fields you want
            .populate('job'); // Populate job details, specify fields you want
        if (!application) {
            return res.status(404).send({
                success: false,
                message: "Application not found"
            });
        }
        return res.status(200).send({
            success: true,
            data: application
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "An error occurred",
            error: error.message
        });
    }
};

const getAllApplications = async (req, res) => {
    const jobId = req.params.id;

    try {
        const applications = await Application.find({ job: jobId })
            .populate('user') // Populate user details, specify fields you want
            .populate('job'); // Populate job details, specify fields you want

        return res.status(200).send({
            success: true,
            data: applications
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "An error occurred",
            error: error.message
        });
    }
};
const getApplicantById = async (req, res) => {
    const {applicationId, userId} = req.params

    try {
         const user = await User.findById(userId)
         if(!user){
            return res.status(404).json({message:'user not found'})
         }
        const application = await Application.findOne({_id:applicationId}).populate('user')
        if (!application) {
            return res.status(404).json({ message: "application not found" })
        }
        return res.status(200).send({
            success: true,
            application,
        })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}


const updateApplication = async (req, res) => {
    const {  applicationId,userId } = req.params
    const { status } = req.body;
    try {
        const application = await Application.findByIdAndUpdate({ _id: applicationId,userId }, { status }, { new: true });

        if (!application) {
            return res.status(404).json({ message: 'application not found' })
        }
        await application.save();
        return  res.status(202).json({
            success: true,
            message: `Your Job Application is ${status}`,
            application
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating application status' });
    }
};


const deleteApplication = async(req,res) => {
    // const { id } = req.params.id
    try {
        const application = await Application.findByIdAndDelete(req.params.id)
        if(!application){
            return res.status(404).json({message:"application not found"})
        }
        // await application.save()

        const users = await User.findByIdAndUpdate(req.params.userId, {
            $pull: { application: application._id }
        }, { new: true })
        const jobs = await Jobs.findByIdAndUpdate(req.params.jobId, {
            $pull: { application: application._id }
        }, { new: true })

        return res.status(200).send({
            sucess: true,
            message: "Application deleted Successfully",
            data: application
        })
    } catch (error) {
        return error;
    }
}





module.exports = { apply, getAllApplications, getApplicationDetails, updateApplication, getApplicantById,deleteApplication }