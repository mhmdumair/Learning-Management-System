import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import HttpError from './utils/HtttpError'
dotenv.config()

const app = express();

//body parser
app.use(express.json({limit:"50mb"}))

//cookie-parser handle cookies in frontend
app.use(cookieParser())

// cors handle resourse handling
app.use(cors({
    origin:process.env.CLIENT_URI
}))

//Test route
app.get('/test',(req:Request,res: Response,next:NextFunction)=>{
    res.status(200).json({
        succses :true,
        message : "Api is working fine"
    })
})

// To handle unknown Routes
app.get('*',(req:Request,res:Response,next:NextFunction)=>{
    const err = new HttpError(`${req.originalUrl} not found`,404)
    next(err)
})

export default app;