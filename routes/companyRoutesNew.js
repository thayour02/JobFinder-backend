const express = require('express')

const router = express.Router()

const {register,signIn,verifyMail,updateCompanyProfile} = require('../controller/company')

const { 
    validateCompanyRegistration, 
    validateLogin, 
    handleValidationErrors 
} = require('../middleware/validation')

router.post('/signup', validateCompanyRegistration, handleValidationErrors, register)
router.post('/login', validateLogin, handleValidationErrors, signIn)
router.post('/verify-email/:id/:token', verifyMail)
router.put('/update-profile', updateCompanyProfile)

module.exports = router
