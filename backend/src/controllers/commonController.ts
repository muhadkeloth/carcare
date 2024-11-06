import Shop, { IShop } from "../models/Shop";
import User, { IUser } from "../models/User";
import { sendOtpEmail } from "../utils/emailService";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const otpgenerateFn = async (email:string,role:string) => {    
    try{
        let existingUser:IShop | IUser | null;
        if(role == 'shop'){
            existingUser = await Shop.findOne({email})
        }else{
            existingUser = await User.findOne({email,role});
        }
        if(!existingUser) return {status:404,message:"Email not found in our records please Signup"};
        if(!existingUser.isActive ) 
            return {status:404,message:"Account is blocked. Please contact customer care."};

        existingUser.otp = crypto.randomInt(100001,999999).toString();
        existingUser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
        existingUser.save();

        await sendOtpEmail(email,existingUser.otp);

        return {status:201,message:"otp sent to your email addrss."};
    }catch(error){
        console.error('otp generation error:',error);
        return {status:500,message:'an error occured.please try again.'};
    }
}


// export const otpgenerate = async (req:Request, res:Response) => {
//     const { email, role } = req.body;
    
//     try{
//         const existingUser:IUser|null = await User.findOne({email,role:'user'});
//         if(!existingUser) return res.status(404).json({message:"Email not found in our records please Signup"});
//         if(!existingUser.isActive ) 
//             return res.status(404).json({message:"Account is blocked. Please contact customer care."});

//         existingUser.otp = crypto.randomInt(100001,999999).toString();
//         existingUser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
//         existingUser.save();

//         await sendOtpEmail(email,existingUser.otp);

//         res.status(201).json({message:"otp sent to your email addrss."})
//     }catch(error){
//         console.error('otp generation error:',error);
//         res.status(500).json({message:'an error occured.please try again.'})
//     }
// }

export const otpvalidationFn = async (email:string,otp:string,role:string) => {
    try{
        let userDetails:IShop | IUser | null;
        if(role == 'shop'){
            userDetails = await Shop.findOne({email})
        }else{
            userDetails = await User.findOne({email,role});
        }
        if(!userDetails) return {status:500,message:'email not found'};
        if(otp !== userDetails?.otp) return {status:404,message:'otp is not currect'};
        if(userDetails?.otpExpiry && new Date() > userDetails.otpExpiry) return {status:404,message:'otp expired!'};
        return {status:201,message:'otp verified'};
    }catch(error){
        console.log('otp error:',error);
        return {status:500,message:'an error on otp validation'};
    }
}

// export const otpvalidation = async(req:Request, res:Response) => {
//     const { otp, email } = req.body;
//     try{
//         const userDetails:IUser|null = await User.findOne({email,role:'user'});
//         if(!userDetails) return res.status(500).json({message:'email not found'});
//         if(otp !== userDetails?.otp) return res.status(404).json({message:'otp is not currect'});
//         if(userDetails?.otpExpiry && new Date() > userDetails.otpExpiry) return res.status(404).json({message:'otp expired!'})
//         res.status(201).json({message:'otp verified'})
//     }catch(error){
//         console.log('otp error:',error);
//         res.status(500).json({message:'an error on otp validation'})
//     }
// }

export const resetPasswordFn = async (email:string,password:string,role:string) => {
    try{
        let userDetails:IShop | IUser | null;
        if(role == 'shop'){
            userDetails = await Shop.findOne({email})
        }else{
            userDetails = await User.findOne({email,role});
        }
        // const userDetails:IUser|null = await User.findOne({email});
        if(!userDetails) return {status:404,message:"email not found"};
        
        userDetails.password = await bcrypt.hash(password, 10);
        delete userDetails.otp;
        delete userDetails.otpExpiry;
        userDetails.save();
        const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
        const token = jwt.sign({id:userDetails._id,role:'shop'}, JWT_SALT , {expiresIn:"1D"})
        return {status:201,token,message:"password reset successfully"};
    }catch(error){
        console.log('reset password error backend')
        return {status:500,message:'errorin resetpasss'};
    }
}

// export const resetPassword = async(req:Request,res:Response) => {
//     const {email,password} = req.body;
//     try{
//         const userDetails:IUser|null = await User.findOne({email});
//         if(!userDetails) return res.status(404).json({message:"email not found"});
        
//         userDetails.password = await bcrypt.hash(password, 10);
//         userDetails.save();
//         res.status(201).json({message:"password reset successfully"})

//     }catch(error){
//         console.log('reset password error backend')
//         res.status(500).json({message:'errorin resetpasss'})
//     }
// }