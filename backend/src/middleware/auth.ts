import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AppError } from "./errorHandler";
import User from "../models/User";
import Shop from "../models/Shop";
import { AuthenticatedRequest, HttpStatusCode } from "../utils/interface";
import UserService from "../services/UserService";
import ShopService from "../services/ShopService";
import UserRepository from "../repositories/UserRepository";
import ShopRepository from "../repositories/ShopRepository";
import AdminRepository from "../repositories/AdminRepository";
import AdminService from "../services/AdminService";
import logger from "./logger";


const userService = new UserService(new UserRepository(User));
const shopService = new ShopService(new ShopRepository(Shop));
const adminService = new AdminService(new AdminRepository(User));

export const authenticateToken = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    const { UNAUTHORIZED, FORBIDDEN } = HttpStatusCode;
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) return next(new AppError("Access Denied",UNAUTHORIZED))
        
        try{
            const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
            const verified = jwt.verify(token, JWT_SALT );
            if(!verified || typeof verified !== 'object'){
                return next(new AppError("Invalid token payload",FORBIDDEN));
            }
            let { id, role } = verified as { id: string; role: string };
            const user = role === 'shop' 
            ? await shopService.findOne({_id:id})
            : role === 'admin' 
            ? await adminService.findOne({_id:id})
            : await userService.findOne({_id:id});
            // if(verified.role == 'shop'){
                //     user = await Shop.findById(verified.id).select('_id isActive').lean();
                // }else{
                    //     user = await User.findById(verified.id).select('_id isActive').lean();
        // }
        if (!user || !user.isActive) {
            return next(new AppError("Access Denied: User inactive or not found", FORBIDDEN));
        }
        // if(!user)return next(new AppError('user not found',FORBIDDEN));
        // if(!user.isActive) return next(new AppError('user is blocked.access denied.',FORBIDDEN));
        // user = user._id || user;
        // req.user = req.user;
        req.user = user._id as string;
        
        logger.info(`req.user: ${req.user}`,)
        next();
    }catch(error){
        const err = error as Error;
        logger.error(`Error in auth ${err.message}` );
        next(new AppError(`Invalid token: ${err.message}`, FORBIDDEN));


    }
}