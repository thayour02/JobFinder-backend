const express = require('express')
const router = express.Router()

const userAuth = require('../middleware/authMiddleware')
const { apply,getAllApplications,getApplicationDetails,updateApplication,getApplicantById,deleteApplication } = require('../controller/application.js')


router.post('/apply-job/:userId/:jobId',userAuth, apply)

router.get('/applications/:id',getAllApplications)

router.get("/applications/:id", userAuth, getApplicationDetails)

router.get("/applicant/:applicationId/:userId", userAuth, getApplicantById)

router.put('/update-application/:applicationId/:userId', userAuth, updateApplication)

router.delete("/delete-application/:applicationId/:userId/:jobId", deleteApplication)
module.exports = router