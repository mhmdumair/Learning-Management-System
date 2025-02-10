import {Request,Response,NextFunction} from 'express';
import {IUser} from '../models/user.model';
import {redis} from './redis'
import dotenv from 'dotenv'
dotenv.config()

interface ITokenOptions{
    expires : Date
    maxAge : number
    httpOnly : boolean
    samSite : 'lax' | 'strict' | 'none' | undefined
    secure : boolean
}

export const accessTokenExpired = parseInt(process.env.ACCESS_TOKEN_EXPIRED || '300',10)
export const refreshTokenExpired = parseInt(process.env.REFRESH_TOKEN_EXPIRED || '1200',10)

// Options for cookies
export const accessTokenOptions :ITokenOptions = {
    expires : new Date(Date.now() + accessTokenExpired * 1000*60*60),
    maxAge : accessTokenExpired * 1000*60,
    httpOnly : true,
    samSite : 'lax',
    secure : false
}
export const refreshTokenOptions :ITokenOptions = {
    expires : new Date(Date.now() + refreshTokenExpired * 1000*60*60*24),
    maxAge : refreshTokenExpired * 1000*60*60*24,
    httpOnly : true,
    samSite : 'lax',
    secure : false
}

export const sendToken = (user :IUser , statusCode : number ,res :Response)=>{
    const accessToken = user.SignAccessToken()
    const refreshToken = user.SignRefreshToken()

    // upload session to redis

    redis.set(user._id,JSON.stringify(user) as any)

    // only set secure to true in production
    if(process.env.NODE_ENV === 'production'){
        accessTokenOptions.secure = true
        refreshTokenOptions.secure = true
    }

    res.cookie('accessToken',accessToken,accessTokenOptions)
    res.cookie('refreshToken',refreshToken,refreshTokenOptions)

    res.status(statusCode).json({
        success : true,
        user,
        accessToken
    })
}