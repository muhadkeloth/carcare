import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from "./errorHandler";

interface AuthenticatedRequest extends Request { user?: string|JwtPayload; }
// interface AuthenticatedRequest extends Request { user?: {
//     id:string;
//     role:string;
// }; }


export const authenticateToken = (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) throw new AppError("Access Denied",401);

    try{
        const verified = jwt.verify(token, JWT_SALT );
        if(!verified || typeof verified !== 'object'){
           return next(new AppError("Invalid token payload",403));
        }
        req.user = verified;
        console.log('req.user:',req.user)
        next();
        // const verified = jwt.verify(token, JWT_SALT, (err, user) => {
        //     if(err){
        //         return next(new AppError("Invalid token payload",403));
        //     }
        //     req.user = user;
        //     next();
        // });
    }catch(error){
        // res.status(400).json({message: });
        next(new AppError("Invalid token",401));
        // if (error instanceof jwt.TokenExpiredError) {
        //     return next(new AppError("Token has expired", 401)); 
        // } else if (error instanceof jwt.JsonWebTokenError) {
        //     return next(new AppError("Invalid token", 403)); 
        // } else {
        //     return next(new AppError("Token verification failed", 500));
        // }
    }
}