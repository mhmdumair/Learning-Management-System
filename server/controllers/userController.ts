import {Request,Response,NextFunction} from 'express'
import userModel,{IUser} from '../models/user.model'
import ErrorHandler from '../utils/ErrorHandler'
import catchAsyncError  from '../middleware/catchAsyncErrors'
import sendMail from '../utils/sendMail'
import jwt,{Secret} from 'jsonwebtoken'
import ejs from 'ejs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

//Register User
interface IUserRegisterBody{
    name :string
    email:string
    password:string
    avatar?:string
}

export const registerUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {name,email,password} =req.body
        const isEmailExists = await userModel.findOne({email})
        if(isEmailExists){
            return next(new ErrorHandler("Email already exists",400))
        }
        const user :IUserRegisterBody = {
            name,
            email,
            password
        }
        const activationToken = createActivationToken(user)
        const activationCode = activationToken.activationCode
        const data = {user: {name:user.name},activationCode}
        const html = ejs.renderFile(path.join(__dirname,'../mails/activation.mail.ejs'),data)

        try{
            await sendMail({
                email:user.email,
                subject:"LMS User Activation",
                template:'activation.mail.ejs',
                data
            })
            res.status(201).json({
                success :true,
                message : 'Check your email to activate your account',
                activationToken : activationToken.token
            })
        }catch(error:any){
            return next(new ErrorHandler(error.message,400))
        }

    } catch (error:any) {
        return  next(new ErrorHandler(error.message,400))
    }
})

interface IActivationToken{
    token:string
    activationCode :string
}

function createActivationToken(user:any):IActivationToken{

    const activationCode = Math.floor(1000+Math.random()*9000).toString()

    const token = jwt.sign({user,activationCode}, //payload
                        process.env.ACTIVATION_SECRET as Secret,//secret
                        {expiresIn:'10m'}) // options

    return {token,activationCode}
}