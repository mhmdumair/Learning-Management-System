import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
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



export default app;