import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AppError } from "./errorHandler";
import User from "../models/User";
import Shop from "../models/Shop";
import { AuthenticatedRequest, HttpStatusCode } from "../utils/interface";




export const authenticateToken = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    const { UNAUTHORIZED, FORBIDDEN } = HttpStatusCode;
    const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) return next(new AppError("Access Denied",UNAUTHORIZED))
        
        try{
            const verified = jwt.verify(token, JWT_SALT );
            console.log('token',token)
        if(!verified || typeof verified !== 'object'){
            return next(new AppError("Invalid token payload",FORBIDDEN));
        }
        let user;
        if(verified.role == 'shop'){
            user = await Shop.findById(verified.id).select('_id isActive').lean();
        }else{
            user = await User.findById(verified.id).select('_id isActive').lean();
        }
        if(!user)return next(new AppError('user not found',FORBIDDEN));
        if(!user.isActive) return next(new AppError('user is blocked.access denied.',FORBIDDEN));
        user = user._id || user;
        req.user = user;
        
        console.log('req.user:',req.user)
        next();
    }catch(error){
        console.log('error in auth',error);
        
        next(new AppError(`Invalid token ${error}`,FORBIDDEN));
        // if (error instanceof jwt.TokenExpiredError) {
        //     return next(new AppError("Token has expired", UNAUTHORIZED)); 
        // } else if (error instanceof jwt.JsonWebTokenError) {
        //     return next(new AppError("Invalid token", FORBIDDEN)); 
        // } else {
        //     return next(new AppError("Token verification failed", 500));
        // }
    }
}