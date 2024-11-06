import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendOtpEmail } from "../utils/emailService";
import jwt from 'jsonwebtoken'
import Shop from "../models/Shop";
import { otpgenerateFn, otpvalidationFn, resetPasswordFn } from "./commonController";


export const login = async (req:Request, res:Response)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email,role:'user'});
        if(!user) return res.status(400).json({message:"User not found"});
        if(!user.isActive ) 
            return res.status(400).json({message:"Account is blocked. Please contact customer care."});
        
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid) return res.status(400).json({message:"Invalid password"});
        
        const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        const token = jwt.sign({id:user._id,role:'user'}, JWT_SALT , {expiresIn:"1D"})

        res.status(201).json({token,role:'', message:"Login successful"})
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
}

export const signup = async (req:Request, res:Response) => {
    const { username, phoneNumber, email, password } = req.body;
    
    try{
        let existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message:'email address already exists'});
        existingUser = await User.findOne({phoneNumber});
        if(existingUser) return res.status(400).json({message:'phoneNumber already exists'});
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({username, phoneNumber, email, password: hashedPassword });
        await user.save();
        console.log('signup page')

        res.status(201).json({message:'User registered successfully'});
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Server error'});
    }
}

export const otpgenerate = async (req:Request, res:Response) => {
    const { email, role } = req.body;
    
    try{
        const response = await otpgenerateFn(email,role);
        res.status(response.status).json({message:response.message})
    }catch(error){
        res.status(500).json({message:'an error occured.please try again.'})
    }
}

export const otpvalidation = async(req:Request, res:Response) => {
    const { otp, email ,role } = req.body;
    try{
        const response = await otpvalidationFn(email,otp,role)
        res.status(response.status).json({message:response.message})
    }catch(error){
        console.log('otp error:',error);
        res.status(500).json({message:'an error on otp validation'})
    }
}

export const resetPassword = async(req:Request,res:Response) => {
    const {email,password, role} = req.body;
    try{
        const response = await resetPasswordFn(email, password, role);
        res.status(response.status).json({message:response.message})
    }catch(error){
        console.log('reset password error backend')
        res.status(500).json({message:'errorin resetpasss'})
    }
}

export const getNearShops = async (req:Request,res:Response) => {
    const { latitude, longitude } = req.query;
    const radiusInKm = 20;
    
    if(!latitude || !longitude){
        return res.status(400).json({message:"Latitude and longitude are required."});
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
        res.status(500).json({message:"server error fetching nearby shops."})
    }
}

