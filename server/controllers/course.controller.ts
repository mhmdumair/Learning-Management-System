import {Request, Response} from 'express';
import ErrorHandler from '../utils/ErrorHandler'
import catchAsyncError  from '../middleware/catchAsyncErrors'
import cloudinary from 'cloudinary'
import { createCourse } from '../services/course.services';


//Upload Course
export const uploadCourse = catchAsyncError(async (req: Request, res: Response, next: any) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if(thumbnail){
            const result = await cloudinary.v2.uploader.upload(thumbnail,{
                folder: 'courses'
            })
            data.thumbnail = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }
        createCourse(data,res,next)
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})