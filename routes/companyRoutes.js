const express = require('express')

const router = express.Router()

const {
    register,
    verifyCompanyMail,
    updateCompanyProfile,
    signIn,getCompanyProfile,
    getCompanies,
    getJoblist,getCompanyById,
    logOut,
    forgetPassword,
    resetPassword,
    deleteProfile
} = require('../controller/company')
   const userAuth = require('../middleware/authMiddleware')


    // REGISTER
    router.post('/reg', register)
    // VERIFY EMAIL
    router.get('/verify-user/:id/:token', verifyCompanyMail)
    //LOGout 
    router.post('/logout', logOut)
    //LOGIN
    router.post('/login', signIn)
    //forgetpassword
    router.post('/forgotten-password', forgetPassword)
    //resetPassword
    router.post('/reset-password/:id/:token', resetPassword)
    //UPDATE
    router.put('/update-profile',userAuth,  updateCompanyProfile)
    //GET DATA
    router.post('/get-company-profile',  getCompanyProfile)
    router.get("/company", getCompanies)
    router.get("/get-joblist", userAuth, getJoblist)
    router.get("/get-company/:id", getCompanyById)
    //
    router.delete('/delete-profile', userAuth, deleteProfile)


    module.exports = router
