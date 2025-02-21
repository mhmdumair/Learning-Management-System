import {Request, Response} from 'express';
import ErrorHandler from '../utils/ErrorHandler'
import catchAsyncError  from '../middleware/catchAsyncErrors'
import cloudinary from 'cloudinary'
import { createCourse } from '../services/course.services';
import courseModel from '../models/course.model';


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


// Edit course

export const editCourse = catchAsyncError(async (req: Request, res: Response, next: any) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if(thumbnail){
            await cloudinary.v2.uploader.destroy(data.thumbnail.public_id)
            const result = await cloudinary.v2.uploader.upload(thumbnail,{
                folder: 'courses'
            })
            data.thumbnail = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }

        const courseId = req.params.id;
        const course = await courseModel.findByIdAndUpdate(courseId,
            {$set: data},
            {new: true}
        )
        res.status(200).json({
            success: true,
            course
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})