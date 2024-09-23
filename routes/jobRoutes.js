const express = require('express')

const router = express.Router()

const {createJob,
    getJobById,
    getJobPost, 
    updateJobs,
    deleteJob,getApplicantsForAjob} = require('../controller/jobs.js')

const userAuth = require('../middleware/authMiddleware.js')

router.post("/postjob", userAuth, createJob)

router.get('/job-detail/:id', getJobById)
router.get('/find-jobs', getJobPost)

router.put('/update-jobs/:jobPostId', userAuth, updateJobs)
router.delete('/delete-job/:id', userAuth, deleteJob)
router.get('/get-applicants/:id',getApplicantsForAjob)


module.exports = router
