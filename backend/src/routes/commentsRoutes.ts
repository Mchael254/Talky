import express, { Router } from 'express'
import { commentOnComment, createComment, deleteComment, getCommentOnComment, getPostComments, updateComment } from '../controllers/commentControllers'


const comment_router = Router()

comment_router.post('/commentOnPost',createComment)
comment_router.get('/getPostComments/:postID',getPostComments)
comment_router.post('/commentOnComment',commentOnComment)
comment_router.get('/getCommentsOnComment/:commentID',getCommentOnComment)
comment_router.put('/updateComment',updateComment)
comment_router.delete('/deleteComment',deleteComment)



export default  comment_router