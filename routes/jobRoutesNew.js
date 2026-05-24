const express = require('express')

const router = express.Router()

const {createJob, updateJobs, getJobDetails, getAllJobs} = require('../controller/jobs')

const { 
    validateJobPosting, 
    handleValidationErrors 
} = require('../middleware/validation')

router.post('/create-job', validateJobPosting, handleValidationErrors, createJob)
router.put('/update-job/:id', validateJobPosting, handleValidationErrors, updateJobs)
router.get('/job-details/:id', getJobDetails)
router.get('/get-all-jobs', getAllJobs)

module.exports = router
