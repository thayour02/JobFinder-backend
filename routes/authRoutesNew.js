const express = require('express')

const router = express.Router()

const {register,signIn,
   verifyMail,
    logOut,
    forgetPassword,resetPassword
} = require('../controller/authCon')

const { 
    validateUserRegistration, 
    validateLogin, 
    validatePasswordReset, 
    validateEmailRequest,
    handleValidationErrors 
} = require('../middleware/validation')

//ip rate limit
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

router.post('/signup', validateUserRegistration, handleValidationErrors, register)
router.post('/login', validateLogin, handleValidationErrors, signIn)
router.post('/logout', logOut)
router.post('/forgot-password', validateEmailRequest, handleValidationErrors, forgetPassword)
router.post('/reset-password/:id/:token', validatePasswordReset, handleValidationErrors, resetPassword)

router.get('/verify-email/:id/:token', verifyMail)

module.exports = router
