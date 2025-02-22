import {Request, Response} from 'express';
import ErrorHandler from '../utils/ErrorHandler'
import catchAsyncError  from '../middleware/catchAsyncErrors'
import cloudinary from 'cloudinary'
import { createCourse } from '../services/course.services';
import courseModel from '../models/course.model';
import { redis } from '../utils/redis';


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


//get single course - without purchasing

export const getSingleCourse = catchAsyncError(async (req: Request, res: Response, next: any) => {
    try {

        const courseId = req.params.id;
        const isCacheExists = await redis.get(courseId)
        
        if(isCacheExists){
            return res.status(200).json({
                success: true,
                course: JSON.parse(isCacheExists)
            })
        }else{
            const course = await courseModel.findById(courseId).select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links')
            await redis.set(courseId,JSON.stringify(course))
            if(!course){
                return next(new ErrorHandler('Course not found', 404))
            }
            res.status(200).json({
                success: true,
                course
            })
        }
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})


// Get All courses -- without purchasing

export const getAllCourses = catchAsyncError(async (req: Request, res: Response, next: any) => {
    try {

        const courses = await courseModel.find().select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links')
        res.status(200).json({
            success: true,
            courses
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})