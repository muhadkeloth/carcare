import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendOtpEmail } from "../utils/emailService";
import jwt from 'jsonwebtoken'
import Shop from "../models/Shop";
import { otpgenerateFn, otpgeneraterForSignup, otpvalidationFn, resetPasswordFn } from "./commonController";
import { AppError } from "../middleware/errorHandler";
import { AuthenticatedRequest, HttpStatusCode } from "../utils/interface";



export const login = async (req:Request, res:Response, next:NextFunction)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email,role:'user'});
        if(!user) throw new AppError("User not found",HttpStatusCode.BAD_REQUEST);
        if(!user.isActive ) 
            throw new AppError("Account is blocked. Please contact customer care.",HttpStatusCode.BAD_REQUEST);
        
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid) throw new AppError("Invalid password",HttpStatusCode.BAD_REQUEST);
        
        const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        const token = jwt.sign({id:user._id,role:'user'}, JWT_SALT , {expiresIn:"1D"})

        res.status(HttpStatusCode.SUCCESS).json({token, message:"Login successful"})
    }catch(error){
        console.log(error)
        // res.status(500).json({message:});
        next(error)
    }
}

export const signupOtpGenerate = async(req:Request, res:Response, next:NextFunction) => {
    const { phoneNumber, email } = req.body;
    try{
        let existingUser = await User.findOne({email});
        if(existingUser) throw new AppError('email address already exists',HttpStatusCode.BAD_REQUEST);
        if(phoneNumber){
            existingUser = await User.findOne({phoneNumber});
            if(existingUser) throw new AppError('phoneNumber already exists',HttpStatusCode.BAD_REQUEST);
        }

        const response = await otpgeneraterForSignup(email);
        res.status(response.status).json({message:response.message,otp:response.hashedOtp})
    }catch(error){
        console.error('error in signup otp generate',error)
        next(error)
    }
}

export const signup = async (req:Request, res:Response, next:NextFunction) => {
    console.log('signup controler')
    const { username, phoneNumber, email, password, otp , userOtp } = req.body;
    try{
        let existingUser = await User.findOne({email});
        if(existingUser) throw new AppError('email address already exists',HttpStatusCode.BAD_REQUEST);
        existingUser = await User.findOne({phoneNumber});
        if(existingUser) throw new AppError('phoneNumber already exists',HttpStatusCode.BAD_REQUEST);
        
        const isOtpValid = await bcrypt.compare(userOtp,otp);
        if(!isOtpValid) throw new AppError("Invalid otp",HttpStatusCode.BAD_REQUEST);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({username, phoneNumber, email, password: hashedPassword });
        await user.save();

        const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        const token = jwt.sign({id:user._id,role:'user'}, JWT_SALT , {expiresIn:"1D"})
        console.log('signup page')
        res.status(HttpStatusCode.CREATED).json({token,role:'user',message:'User registered successfully'});
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
        throw new AppError("Latitude and longitude are required.",HttpStatusCode.BAD_REQUEST);
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
            },
            {
                $limit:3
            }
        ]);
        console.log('shop',shops)

        res.status(HttpStatusCode.SUCCESS).json({shops,message:'successfully fetch shops '});
    } catch (error) {
        console.error("error fetching nearby shops:",error);
        // res.status(500).json({message:"server error fetching nearby shops."})
        next(error)
    }
}

export const userDetails = async(req:AuthenticatedRequest,res:Response, next:NextFunction) => {
    if(!req.user) throw new AppError('error to find userdetails',HttpStatusCode.BAD_REQUEST);

    try {
        const user = await User.findById(req.user)
        if(!user) throw new AppError('finding user details failed ',HttpStatusCode.NOT_FOUND);
            const userdet = {
                _id:user?._id,
                username:user?.username,
                phoneNumber:user?.phoneNumber,
                email:user?.email,
                // image:user?.image,
                isActive:user?.isActive,
                role:user?.role,
            }
            res.status(HttpStatusCode.SUCCESS).json({userdet,message:'User details fetched successfully'})
    } catch (error) {
        console.error("error fetching nearby userdetails:",error);
        next(error)
    }
}

export const shopDetails = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
        if(!req.user) throw new AppError('Error: User not found or authenticated',HttpStatusCode.NOT_FOUND);
        const id = req.params.id;
        const shopUser = await Shop.findOne({_id:id,isActive:true}).select('-password -otp -otpExpiry').lean();
        if(!shopUser) throw new AppError('shop user not found in backend',HttpStatusCode.NOT_FOUND);
        res.status(HttpStatusCode.SUCCESS).json({shopUser,message:"shop User find successfully"})
    } catch (error) {
        console.error('Error finding shopuser details:', error);
        next(error);
    }
}
