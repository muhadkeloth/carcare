import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { Document, Types } from "mongoose";


export enum HttpStatusCode {
    SUCCESS = 200,
    CREATED = 201,  
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

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
    vehicleIds?: {
        brand:string;
        vehicleModelIds:Types.ObjectId[];
    }[];
    estimate?:{
        work:string;
        priceStart:number;
        priceEnd:number;
    }[];
    about?:string;
}

export interface IVehicle extends Document {
    _id: string | Types.ObjectId;
    brand:string;
    vehicleModel:string;
    createdAt?:Date;
}

export interface IEstimate extends Document {
    work:string;
    details:[{
        price:number;
        vehicles: Types.ObjectId[];
    }],
    createdAt?:Date;
}


export interface AuthenticatedRequest extends Request { user?: string | JwtPayload; }
