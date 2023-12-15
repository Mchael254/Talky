import express, { json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import user_router from './routes/userRoutes'
import post_router from './routes/postRoutes'
import follow_router from './routes/followRoutes'
import comment_router from './routes/commentsRoutes'
import likes_router from './routes/likesRoutes'





dotenv.config()
const port = process.env.PORT || 5200
const app = express()
app.use(json())
app.use(cors())

app.use('/user',user_router)
app.use('/follow',follow_router)
app.use('/post',post_router)
app.use('/comment',comment_router)
app.use('/likes',likes_router)




app.listen(port,()=>{
    console.log(`Talky running on port ${port}`);
})