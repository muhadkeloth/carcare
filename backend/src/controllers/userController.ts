import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendOtpEmail } from "../utils/emailService";


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
    const { email } = req.body;
    
    try{
        const existingUser:IUser|null = await User.findOne({email});
        if(!existingUser) return res.status(404).json({message:"Email not found in our records please Signup"});
        if(!existingUser.isActive ) 
            return res.status(404).json({message:"Account is blocked. Please contact customer care."});

        existingUser.otp = crypto.randomInt(100001,999999).toString();
        existingUser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
        existingUser.save();

        await sendOtpEmail(email,existingUser.otp);

        res.status(201).json({message:"otp sent to your email addrss."})
    }catch(error){
        console.error('otp generation error:',error);
        res.status(500).json({message:'an error occured.please try again.'})
    }
}

export const otpvalidation = async(req:Request, res:Response) => {
    const { otp, email } = req.body;
    try{
        const userDetails:IUser|null = await User.findOne({email});
        if(!userDetails) return res.status(500).json({message:'email not found'});
        if(otp !== userDetails?.otp) return res.status(404).json({message:'otp is not currect'});
        if(userDetails?.otpExpiry && new Date() > userDetails.otpExpiry) return res.status(404).json({message:'otp expired!'})
        res.status(201).json({message:'otp verified'})
    }catch(error){
        console.log('otp error:',error);
        res.status(500).json({message:'an error on otp validation'})
    }
}

export const resetPassword = async(req:Request,res:Response) => {
    const {email,password} = req.body;
    try{
        const userDetails:IUser|null = await User.findOne({email});
        if(!userDetails) return res.status(404).json({message:"email not found"});
        
        userDetails.password = await bcrypt.hash(password, 10);
        userDetails.save();
        res.status(201).json({message:"password reset successfully"})

    }catch(error){
        console.log('reset password error backend')
        res.status(500).json({message:'errorin resetpasss'})
    }
}