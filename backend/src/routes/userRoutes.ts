import express, { Router } from 'express'
import {  checkUserDetails, followUser, getAllUsers,  get_email_userName, initiate_password_reset, loginUser, registerUser, resetPassword, updateProfile, upload,uploadProfilePic1 } from '../controllers/userControllers'
import { verifyToken } from '../middleware/tokenVerify.ts'
const user_router = Router()

user_router.get('/',getAllUsers)
user_router.post('/register',registerUser)
user_router.post('/login',loginUser)
user_router.put('/updateProfile',updateProfile)
user_router.get('/get_email_userName',get_email_userName)
user_router.get('/check_user_details', verifyToken, checkUserDetails)
user_router.post('/followUser',followUser)
user_router.post('/picUpload',upload,uploadProfilePic1)
user_router.post('/requestPasswordReset', initiate_password_reset)
user_router.post('/resetPassword', resetPassword)



export default  user_router