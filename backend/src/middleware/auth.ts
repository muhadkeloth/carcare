import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AppError } from "./errorHandler";
import User from "../models/User";
import Shop from "../models/Shop";
import { AuthenticatedRequest } from "../utils/interface";


// interface AuthenticatedRequest extends Request { user?: {
//     id:string;
//     role:string;
// }; }


export const authenticateToken = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) return next(new AppError("Access Denied",401))

    try{
        const verified = jwt.verify(token, JWT_SALT );
        if(!verified || typeof verified !== 'object'){
            return next(new AppError("Invalid token payload",403));
        }
        let user;
        if(verified.role == 'shop'){
            user = await Shop.findById(verified.id);
        }else{
            user = await User.findById(verified.id);
        }
        if(!user)return next(new AppError('user not found',403));
        if(!user.isActive) return next(new AppError('user is blocked.access denied.',403));
        user = user._id || user;
        req.user = user;
        
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
        next(new AppError(`Invalid token${error}`,403));
        // if (error instanceof jwt.TokenExpiredError) {
        //     return next(new AppError("Token has expired", 401)); 
        // } else if (error instanceof jwt.JsonWebTokenError) {
        //     return next(new AppError("Invalid token", 403)); 
        // } else {
        //     return next(new AppError("Token verification failed", 500));
        // }
    }
}