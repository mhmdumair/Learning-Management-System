import courseModel from '../models/course.model';
import { Response } from 'express';
import catchAsyncErrors from '../middleware/catchAsyncErrors';

//Create course
export const createCourse = catchAsyncErrors(async (data:any,res: Response) => {
    const course = await courseModel.create(data);
    res.status(201).json({
        success: true,
        course
    })
}) 

