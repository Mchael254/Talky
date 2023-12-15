import express, { Router } from 'express'
import { createPost, deletePost, getAllPosts, getUserPosts, upload2 } from '../controllers/postControllers'

const post_router = Router()

//create post
post_router.post('/createPost',upload2,createPost)
post_router.get('/getUserPosts',getUserPosts)
post_router.get('/',getAllPosts)
post_router.delete('/deletePost',deletePost)






export default  post_router