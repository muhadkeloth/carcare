import { NextFunction, Response } from "express";
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
    const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) return next(new AppError("Access Denied",FORBIDDEN))
        
        try{
            const verified = jwt.verify(token, JWT_SALT );
            if(!verified || typeof verified !== 'object'){
                return next(new AppError("Invalid token payload",FORBIDDEN));
            }
            let { id, role } = verified as { id: string; role: string };
            const roleServiceMap:Record<string, any> = {
                shop: shopService,
                admin: adminService,
                user: userService,
            };
            const service = roleServiceMap[role];
            if(!service){
                return next(new AppError(`Access Denied: Invalid role '${role}'`, FORBIDDEN));
            };
            const user = await service.findOne({ _id: id });
        if (!user || !user.isActive) {
            return next(new AppError("Access Denied: User inactive or not found", FORBIDDEN));
        }
        req.user = user._id as string;
        req.userRole = role;
        
        logger.info(`req.user: ${req.user}`,)
        next();
    }catch(error){
      const err = error as Error;
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn("Access token expired. Sending 401 for refresh.");
        return next(new AppError(`Token expired: ${err.message}`, UNAUTHORIZED));
      }
        logger.error(`Error in auth ${err.message}` );
        next(new AppError(`Invalid token: ${err.message}`, FORBIDDEN));
    }
}



export const roleBasedAccess = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return next(
        new AppError(
          "Access Denied: User role missing in request",
          HttpStatusCode.FORBIDDEN
        )
      );
    }
    if (!allowedRoles.includes(req.userRole)) {
      return next(
        new AppError(
          "Access Denied: Insufficient permissions",
          HttpStatusCode.FORBIDDEN
        )
      );
    }
    next();
  };
};
  
