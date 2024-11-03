// import { Request, Response } from "express";
// import bcrypt from 'bcryptjs'
// import User from "../models/User";
// import jwt from 'jsonwebtoken'

// export const login = async (req:Request, res:Response)=>{
//     console.log('login user')
//     const {email,password} = req.body;
//     try{
//         const user = await User.findOne({email});
//         if(!user) return res.status(400).json({message:"User not found"});
//         if(!user.isActive ) 
//             return res.status(400).json({message:"Account is blocked. Please contact customer care."});
        
//         const isPasswordValid = await bcrypt.compare(password,user.password);
//         if(!isPasswordValid) return res.status(400).json({message:"Invalid password"});
        
//         const JWT_SALT = process.env.JWT_SALT || 'sem_nem_kim_12@32';
//         const token = jwt.sign({id:user._id}, JWT_SALT , {expiresIn:"1D"})

//         res.json({token, message:"Login successful"})
//     }catch(error){
//         res.status(500).json({message:"Server error"});
//     }
// }

