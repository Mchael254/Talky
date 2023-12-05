import express, { Router } from 'express'
import {  get_email_userName, loginUser, registerUser } from '../controllers/userControllers'
const user_router = Router()

user_router.post('/register',registerUser)
user_router.post('/login',loginUser)
user_router.get('/get_email_userName',get_email_userName)


export default  user_router