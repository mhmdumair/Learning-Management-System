import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import ErrorHandler from './utils/ErrorHandler'
import errorHandlerMiddleware from './middleware/error'
import userRouter from './routes/user.route'
dotenv.config()

const app = express();

//body parser
app.use(express.json({limit:"50mb"}))

//cookie-parser handle cookies in frontend
app.use(cookieParser())

// cors handle recourse handling
app.use(cors({
    origin:process.env.CLIENT_URI
}))

//routes
app.use('/api/v1',userRouter)

//Test route
app.get('/test',(req:Request,res: Response,next:NextFunction)=>{
    res.status(200).json({
        success :true,
        message : "Api is working fine"
    })
})

// To handle unknown Routes
app.get('*',(req:Request,res:Response,next:NextFunction)=>{
    const err = new ErrorHandler(`${req.originalUrl} not found`,404)
    next(err)
})

app.use(errorHandlerMiddleware)

export default app;