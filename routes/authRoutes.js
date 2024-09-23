const express = require('express')


const router = express.Router()

const {register,signIn,
   verifyMail,
    logOut,
    forgetPassword,resetPassword
} = require('../controller/authCon')


//ip rate limit
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

router.post('/signup',  register)
router.post('/login', signIn)
router.post('/logout', logOut)
router.post('/forgot-password', forgetPassword)
router.post('/reset-password/:id/:token', resetPassword)

router.get('/verify-email/:id/:token', verifyMail)




module.exports = router