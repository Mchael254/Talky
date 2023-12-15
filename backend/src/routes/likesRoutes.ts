import Router from 'express'
import { likeComment, likePost, unlikeComment, unlikePost } from '../controllers/likesControllers'

const likes_router = Router()



likes_router.post('/likeComment',likeComment)
likes_router.post('/unlikeComment',unlikeComment)
likes_router.post('/likePost',likePost)
likes_router.post('/unlikePost',unlikePost)



export default likes_router