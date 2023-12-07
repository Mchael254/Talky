import express, { Router } from 'express'
import {  checkUserDetails, followUser, getAllUsers, get_email_userName, loginUser, registerUser } from '../controllers/userControllers'
import { verifyToken } from '../middleware/tokenVerify.ts'
const user_router = Router()

user_router.get('/',getAllUsers)
user_router.post('/register',registerUser)
user_router.post('/login',loginUser)
user_router.get('/get_email_userName',get_email_userName)
user_router.get('/check_user_details', verifyToken, checkUserDetails)
user_router.post('/followUser',followUser)


export default  user_router