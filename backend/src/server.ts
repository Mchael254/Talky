import express, { json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const port = process.env.PORT || 5200
const app = express()
app.use(json())
app.use(cors())



app.listen(port,()=>{
    console.log(`Talky running on port ${port}`);
})