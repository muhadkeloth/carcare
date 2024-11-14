import Shop from "../models/Shop";
import User from "../models/User";
import { sendOtpEmail } from "../utils/emailService";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { HttpStatusCode, IShop, IUser } from "../utils/interface";

export const otpgenerateFn = async (email:string,role:string) => {    
    try{
        let existingUser:IShop | IUser | null;
        if(role == 'shop'){
            existingUser = await Shop.findOne({email})
        }else{
            existingUser = await User.findOne({email,role});
        }
        if(!existingUser) return {status:HttpStatusCode.NOT_FOUND,message:"Email not found in our records please Signup"};
        if(!existingUser.isActive ) 
            return {status:HttpStatusCode.NOT_FOUND,message:"Account is blocked. Please contact customer care."};

        existingUser.otp = crypto.randomInt(100001,999999).toString();
        existingUser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
        existingUser.save();
        
        await sendOtpEmail(email,existingUser.otp);
        
        return {status:HttpStatusCode.CREATED,message:"otp sent to your email addrss."};
    }catch(error){
        console.error('otp generation error:',error);
        return {status:HttpStatusCode.INTERNAL_SERVER_ERROR,message:'an error occured.please try again.'};
    }
}

export const otpgeneraterForSignup = async (email:string) => {
    try {
        const otp = crypto.randomInt(100001,999999).toString();
        await sendOtpEmail(email,otp);
        const hashedOtp = await bcrypt.hash(otp, 10);
        return {status:HttpStatusCode.CREATED,hashedOtp,message:'otp sent to your email address.'}
        
    } catch (error) {
        console.error('otp generation sign error:',error);
        return {status:HttpStatusCode.INTERNAL_SERVER_ERROR,message:'error occured sign generate .please try again.'};
    }
}



export const otpvalidationFn = async (email:string,otp:string,role:string) => {
    try{
        let userDetails:IShop | IUser | null;
        if(role == 'shop'){
            userDetails = await Shop.findOne({email})
        }else{
            userDetails = await User.findOne({email,role});
        }
        if(!userDetails) return {status:HttpStatusCode.INTERNAL_SERVER_ERROR,message:'email not found'};
        if(otp !== userDetails?.otp) return {status:HttpStatusCode.NOT_FOUND,message:'otp is not currect'};
        if(userDetails?.otpExpiry && new Date() > userDetails.otpExpiry) return {status:HttpStatusCode.NOT_FOUND,message:'otp expired!'};
        return {status:HttpStatusCode.SUCCESS,message:'otp verified'};
    }catch(error){
        console.log('otp error:',error);
        return {status:HttpStatusCode.INTERNAL_SERVER_ERROR,message:'an error on otp validation'};
    }
}


export const resetPasswordFn = async (email:string,password:string,role:string) => {
    try{
        let userDetails:IShop | IUser | null;
        if(role == 'shop'){
            userDetails = await Shop.findOne({email})
        }else{
            userDetails = await User.findOne({email,role});
        }
        // const userDetails:IUser|null = await User.findOne({email});
        if(!userDetails) return {status:HttpStatusCode.NOT_FOUND,message:"email not found"};
        
        userDetails.password = await bcrypt.hash(password, 10);
        delete userDetails.otp;
        delete userDetails.otpExpiry;
        userDetails.save();
        const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        const token = jwt.sign({id:userDetails._id,role:'shop'}, JWT_SALT , {expiresIn:"1D"})
        return {status:HttpStatusCode.CREATED,token,message:"password reset successfully"};
    }catch(error){
        console.log('reset password error backend')
        return {status:HttpStatusCode.INTERNAL_SERVER_ERROR,message:'errorin resetpasss'};
    }
}

