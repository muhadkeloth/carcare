import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendOtpEmail } from "../utils/emailService";
import jwt from 'jsonwebtoken'
import Shop from "../models/Shop";
import { otpgenerateFn, otpvalidationFn, resetPasswordFn } from "./commonController";
import { AppError } from "../middleware/errorHandler";




export const login = async (req:Request, res:Response, next:NextFunction)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email,role:'user'});
        if(!user) throw new AppError("User not found",400);
        if(!user.isActive ) 
            throw new AppError("Account is blocked. Please contact customer care.",400);
        
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid) throw new AppError("Invalid password",400);
        
        const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        const token = jwt.sign({id:user._id,role:'user'}, JWT_SALT , {expiresIn:"1D"})

        res.status(201).json({token,role:'', message:"Login successful"})
    }catch(error){
        console.log(error)
        // res.status(500).json({message:});
        next(error)
    }
}

export const signup = async (req:Request, res:Response, next:NextFunction) => {
    const { username, phoneNumber, email, password } = req.body;
    
    try{
        let existingUser = await User.findOne({email});
        if(existingUser) throw new AppError('email address already exists',400);
        existingUser = await User.findOne({phoneNumber});
        if(existingUser) throw new AppError('phoneNumber already exists',400);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({username, phoneNumber, email, password: hashedPassword });
        await user.save();
        console.log('signup page')
        
        res.status(201).json({message:'User registered successfully'});
    }catch(error){
        console.log(error)
        // res.status(500).json({message:'Server error'});
        next(error)
    }
}

export const otpgenerate = async (req:Request, res:Response, next:NextFunction) => {
    const { email, role } = req.body;
    
    try{
        const response = await otpgenerateFn(email,role);
        res.status(response.status).json({message:response.message})
    }catch(error){
        // res.status(500).json({message:'an error occured.please try again.'})
        next(error)
    }
}

export const otpvalidation = async(req:Request, res:Response, next:NextFunction) => {
    const { otp, email ,role } = req.body;
    try{
        const response = await otpvalidationFn(email,otp,role)
        res.status(response.status).json({message:response.message})
    }catch(error){
        console.log('otp error:',error);
        // res.status(500).json({message:'an error on otp validation'})
        next(error)
    }
}

export const resetPassword = async(req:Request,res:Response, next:NextFunction) => {
    const {email,password, role} = req.body;
    try{
        const response = await resetPasswordFn(email, password, role);
        res.status(response.status).json({message:response.message})
    }catch(error){
        console.log('reset password error backend')
        // res.status(500).json({message:'errorin resetpasss'})
        next(error)
    }
}

export const getNearShops = async (req:Request,res:Response, next:NextFunction) => {
    const { latitude, longitude } = req.query;
    const radiusInKm = 20;
    
    if(!latitude || !longitude){
        throw new AppError("Latitude and longitude are required.",400);
    }
    try {
        const shops = await Shop.aggregate([
            {
                $geoNear:{
                    near: { type: "Point", coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)] },
                    distanceField:"distance",
                    maxDistance:radiusInKm * 1000,
                    spherical:true
                }
            },
            {
                $match:{isActive:true}
            }
        ]);
        console.log('shop',shops)

        res.status(200).json({shops,message:'successfully fetch shops '});
    } catch (error) {
        console.error("error fetching nearby shops:",error);
        // res.status(500).json({message:"server error fetching nearby shops."})
        next(error)
    }
}

