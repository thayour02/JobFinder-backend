const express = require('express')

const router = express.Router()

const userAuth = require('../middleware/authMiddleware.js')
const {getUserById,updateUser,getUsers,getUserProfile,deleteUser,getAlljobAppliedFor} = require('../controller/usersController.js')


router.put('/update-user', userAuth, updateUser)

router.get("/find-users", getUsers)

router.get('/get-user/:id',  getUserById)

router.get('/get-user',userAuth, getUserProfile)

router.get('/get-application',userAuth, getAlljobAppliedFor)

router.delete('/delete-user',userAuth,deleteUser)

module.exports = router