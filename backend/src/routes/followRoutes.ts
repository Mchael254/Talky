import express, { Router } from 'express'
import { addFollow, getFollowers, getFollowing, unFollow } from '../controllers/followControllers'

const follow_router = Router()

//follow,unfollow,getFollowers,getFollowing
follow_router.post('/addFollow',addFollow)
follow_router.get('/getFollowers/:userID',getFollowers)
follow_router.get('/getFollowing/:userID',getFollowing)
follow_router.post('/unFollow',unFollow)





export default  follow_router