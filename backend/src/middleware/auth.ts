import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';


const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';

export const authenticateToken = (req:Request, res:Response, next:NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) return res.status(401).json({message:"Access Denied"});

    try{
        const verified = jwt.verify(token, JWT_SALT);
        (req as any).user = verified;
        // req. = verified;
        next();
    }catch(error){
        res.status(400).json({message:"Invalid token" });
    }
}