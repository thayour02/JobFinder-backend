const mongoose = require('mongoose')
const Jobs = require('../model/jobModel.js')
const Company = require('../model/companyModel.js');
const Application = require('../model/applicationModel.js')

const createJob = async (req, res, next) => {
    try {
        const { jobTitle,
            jobType,
            location,
            salary,
            vacancy,
            experience,
            desc,
            requirement
        } = req.body;


        //getting userId from authMiddleware and verifying it
        const id = req.body.user.userId;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No account for this id:${id}`)
        }
        //creating jobs and save it
        const jobPost = new Jobs({
            jobTitle, jobType,
            location, salary,
            vacancy, experience,
            detail: { desc, requirement },
            company: id
        })
        await jobPost.save()

        // update company information with job id
        const company = await Company.findById(id)
        company.jobPosts.push(jobPost._id)

        const updateCompany = await Company.findByIdAndUpdate(id, company,
            { new: true })

        res.status(202).json({
            success: true,
            messge: "Job Post Successfully",
            jobPost
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error.message })
    }
}

const updateJobs = async (req, res, next) => {
    try {
        const {
            company, jobTitle, jobType, location, salary,
            vacancies, experience, desc, requirements
        } = req.body;

        const { jobPostId } = req.params;
        if (
            !jobTitle ||
            !jobType ||
            !location ||
            !salary ||
            !desc ||
            !requirements ||
            !company
        ) {
            return res.status(500).send('please fill all the fields');
        }

        const id = req.body.user.userId

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No account for this id:${id}`)
        }


        const jobPost = {
            jobTitle, jobType,
            location, salary,
            vacancies, experience,
            details: { desc, requirements },
            id: jobPostId
        }

        await Jobs.findByIdAndUpdate(jobPostId, jobPost, { new: true })

        res.status(202).json({
            success: true,
            messge: "Job Update Successfully",
            jobPost
        })

    } catch (error) {
        return res.status(404).json({ message: error.message })

    }
}

const getJobPost = async (req, res, next) => {
    try {
        const { search, sort, location, jType, exp } = req.query;

        const types = jType?.split(",")
        const experience = exp?.split("-")

        let queryObj = {};

        //searchByLocation
        if (location) {
            queryObj.location = { $regex: location, $options: "i" }
        }

        // fillterbyJobType
        if (jType) {
            queryObj.jobType = { $in: types }
        }

        //fiterby Experienc
        if (exp) {
            queryObj.experience = {
                $gte: Number(experience[0]) - 1,
                $lte: Number(experience[1]) + 1,
            }
        }

        // searchBy jobType or jobTitle
        if (search) {
            const searchQuery = {
                $or: [
                    { jobTitle: { $regex: search, $options: "i" } },
                    { jobType: { $regex: search, $options: "i" } },
                ],
            }
            queryObj = { ...queryObj, ...searchQuery }
        }

        // find seaarch item query  in  the to database
        let queryResult = Jobs.find(queryObj).populate({
            path: "company",
            select: "-password",
        })


        // sort
        if (sort === "Newest") {
            queryResult = queryResult.sort("-createdAt")
        } else if (sort === "Oldest") {
            queryResult = queryResult.sort("createdAt")
        } else if (sort === "A-Z") {
            queryResult = queryResult.sort("jobTitle");
        } else if (sort === "Z-A") {
            queryResult = queryResult.sort("-jobTitle")
        }

        //PAGINATION
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 9;

        const skip = (page - 1) * limit;

        //records count
        const total = await Jobs.countDocuments(queryResult);
        const numPage = Math.ceil(total / limit)

        queryResult = queryResult.limit(limit * page)

        const jobs = await queryResult;

        res.status(200).json({
            success: true,
            total,
            page,
            data: jobs,
            numPage,
        })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

const deleteJob = async (req, res, next) => {
    try {
        const id = req.params.id
        const job = await Jobs.findById(id)
        if (!job) {
            return res.status(404).json({ message: "Job Not Found" })
        }
        // getting the companyId from job schema ref
        const companyId = job.company
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company Not Found" });
        }
        // Remove job reference from company
        company.jobPosts.pull(job._id);
        await company.save();

        // Delete job
        await Jobs.findByIdAndDelete(id);



        res.status(202).json({
            success: true,
            message: "Job deleted Successfully",
        })


    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}
const getJobById = async (req, res, next) => {
    try {
        const jobId = req.params.id;

        const job = await Jobs.findById(jobId).populate({
            path: "company",
            select: "-password",
        }).populate({
            path:"application",
        })
        if (!job) {
            return res.status(200).send({
                message: "Job Post Not Found",
                success: false
            })
        }

        //Get SIMILAR JOB POST
        const jobTitleRegex = new RegExp(job.jobTitle, 'i');
        const jobTypeRegex = new RegExp(job.jobType, 'i');

        const searchQuery = {
            $or: [
                { jobTitle: { $regex: jobTitleRegex } },
                { jobType: { $regex: jobTypeRegex } },
            ],
        };

        let queryResult = Jobs.find(searchQuery).populate({
            path: "company",
            select: "-password",
        })
            .sort({ _id: -1 })

        queryResult = queryResult.limit(6);

        const similarJob = await queryResult;

        res.status(200).json({
            success: true,
            data: job,
            similarJob
        })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

const getApplicantsForAjob = async (req,res)=>{
    try {
        const jobId = req.params.id;
        const applications = await Application.find({ job: jobId })
            .populate('user'); // Populate user details
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
}

module.exports = { createJob, getJobById, getJobPost, updateJobs, deleteJob,getApplicantsForAjob }