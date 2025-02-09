import {Request, Response, NextFunction} from 'express';
import catchAsyncErrors from './catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import jwt, { JwtPayload } from 'jsonwebtoken'
import {redis} from '../utils/redis'
import dotenv from 'dotenv'
dotenv.config()

// authenticated User
export const isAuthenticated = catchAsyncErrors(async (req:Request,res:Response,next:NextFunction)=>{
    const access_token = req.cookies.accessToken
    if (!access_token) {
        return next(new ErrorHandler('Login first to access this resource',401))
    }
    const decode = jwt.verify(access_token,process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload

    const user = await redis.get(decode.id)

    if(!user){
        return next(new ErrorHandler('User not found',400))
    }

    req.user = JSON.parse(user)
    next()
})