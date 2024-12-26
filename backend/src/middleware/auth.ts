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
    const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) return next(new AppError("Access Denied",UNAUTHORIZED))
        
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
            // const user = role === 'shop' 
            // ? await shopService.findOne({_id:id})
            // : role === 'admin' 
            // ? await adminService.findOne({_id:id})
            // : await userService.findOne({_id:id});
        if (!user || !user.isActive) {
            return next(new AppError("Access Denied: User inactive or not found", FORBIDDEN));
        }
        req.user = user._id as string;
        req.userRole = role;
        
        logger.info(`req.user: ${req.user}`,)
        next();
    }catch(error){
        const err = error as Error;
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
  



// ****************************

// export const authenticateTokenOfShop = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
//     const { UNAUTHORIZED, FORBIDDEN } = HttpStatusCode;
//     const shopService = new ShopService(new ShopRepository(Shop));
//     const token = req.header('Authorization')?.split(' ')[1];
//     if(!token) return next(new AppError("Access Denied",UNAUTHORIZED))
        
//         try{
//             const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
//             const verified = jwt.verify(token, JWT_SALT );
//             if(!verified || typeof verified !== 'object'){
//                 return next(new AppError("Invalid token payload",FORBIDDEN));
//             }
//             let { id, role } = verified as { id: string; role: string };
//             if(role !== 'shop') return next(new AppError("Authentication Error: shop token failed", FORBIDDEN));
//             const user =  await shopService.findOne({_id:id})
//             // ? await shopService.findOne({_id:id})
//             // : role === 'admin' 
//             // ? await adminService.findOne({_id:id})
//             // : await userService.findOne({_id:id});
//         if (!user || !user.isActive) {
//             return next(new AppError("Access Denied: User inactive or not found", FORBIDDEN));
//         }
//         req.user = user._id as string;
        
//         logger.info(`req.user: ${req.user}`,)
//         next();
//     }catch(error){
//         const err = error as Error;
//         logger.error(`Error in auth ${err.message}` );
//         next(new AppError(`Invalid token: ${err.message}`, FORBIDDEN));
//     }
// }

// export const authenticateTokenOfUser = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
//     const { UNAUTHORIZED, FORBIDDEN } = HttpStatusCode;
//     const userService = new UserService(new UserRepository(User));
//     const token = req.header('Authorization')?.split(' ')[1];
//     if(!token) return next(new AppError("Access Denied",UNAUTHORIZED))
        
//         try{
//             const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
//             const verified = jwt.verify(token, JWT_SALT );
//             if(!verified || typeof verified !== 'object'){
//                 return next(new AppError("Invalid token payload",FORBIDDEN));
//             }
//             let { id, role } = verified as { id: string; role: string };
//             if(role !== 'user') return next(new AppError("Authentication Error: user token failed", FORBIDDEN));
//             const user =  await userService.findOne({_id:id})
//             // ? await shopService.findOne({_id:id})
//             // : role === 'admin' 
//             // ? await adminService.findOne({_id:id})
//             // : await userService.findOne({_id:id});
//         if (!user || !user.isActive) {
//             return next(new AppError("Access Denied: User inactive or not found", FORBIDDEN));
//         }
//         req.user = user._id as string;
        
//         logger.info(`req.user: ${req.user}`,)
//         next();
//     }catch(error){
//         const err = error as Error;
//         logger.error(`Error in auth ${err.message}` );
//         next(new AppError(`Invalid token: ${err.message}`, FORBIDDEN));

//     }
// }

// export const authenticateTokenOfAdmin = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
//     const { UNAUTHORIZED, FORBIDDEN } = HttpStatusCode;
//     const adminService = new AdminService(new AdminRepository(User));
//     const token = req.header('Authorization')?.split(' ')[1];
//     if(!token) return next(new AppError("Access Denied",UNAUTHORIZED))
        
//         try{
//             const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
//             const verified = jwt.verify(token, JWT_SALT );
//             if(!verified || typeof verified !== 'object'){
//                 return next(new AppError("Invalid token payload",FORBIDDEN));
//             }
//             let { id, role } = verified as { id: string; role: string };
//             if(role !== 'admin') return next(new AppError("Authentication Error: admin token failed", FORBIDDEN));
//             const user =  await adminService.findOne({_id:id})
//             // ? await shopService.findOne({_id:id})
//             // : role === 'admin' 
//             // ? await adminService.findOne({_id:id})
//             // : await userService.findOne({_id:id});
//         if (!user || !user.isActive) {
//             return next(new AppError("Access Denied: User inactive or not found", FORBIDDEN));
//         }
//         req.user = user._id as string;
        
//         logger.info(`req.user: ${req.user}`,)
//         next();
//     }catch(error){
//         const err = error as Error;
//         logger.error(`Error in auth ${err.message}` );
//         next(new AppError(`Invalid token: ${err.message}`, FORBIDDEN));

//     }
// }