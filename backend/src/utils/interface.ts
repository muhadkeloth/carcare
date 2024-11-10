import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { Document, Types } from "mongoose";



export interface IUser extends Document {
    username:string;
    phoneNumber:string;
    email:string;
    password:string;
    isActive:boolean;
    role:'user' | 'admin';
    otp?: string;
    otpExpiry?:Date;
    createdAt?:Date;
}

export interface IShop extends Document {
    shopName:string;
    ownerName:string;
    phoneNumber:string;
    email:string;
    password?:string;
    isActive:boolean;
    otp?: string;
    otpExpiry?:Date;
    address:{
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    location:{
        type:"Point";
        coordinates: [number, number];
    };
    image:string;
    createdAt?:Date;
    vehicleIds: Types.ObjectId[];
}

export interface IVehicle extends Document {
    brand:string;
    vehicleModel:string;
    year:[number];
    createdAt?:Date;
}


export interface AuthenticatedRequest extends Request { user?: string | JwtPayload; }
