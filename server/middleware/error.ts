import ErrorHandler from '../utils/ErrorHandler'
import express, { NextFunction, Request, Response } from 'express';

const errorHandlerMiddleware = (err:any , req: Request,res :Response,next:NextFunction)=>{

    err.statusCode = err.statusCode || 500
    err.message = err.message || 'Internal server Error'

    // wrong mongoDb id
    if (err.name === 'CastError') {
        const message = `Resource not found: Invalid value for ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Duplicate key Error
    if (err.code === 11000) {
        const message = `Duplicate value entered for field: ${Object.keys(err.keyValue).join(', ')}`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong jwt error
    if(err.name === 'JsonWebTokenError'){
        const message = `Json web token is invalid, try again`
        err = new ErrorHandler(message,400)
    }

    //token expired error
    if(err.name === 'TokenExpiredError'){
        const message = `Json web token is expired, try again`
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })
}

export default errorHandlerMiddleware