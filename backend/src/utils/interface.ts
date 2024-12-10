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
    image?:string;
}

interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string
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
    address:Address;
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
    discription:{title:string;discript:string};
    workingTime?:{opening:string;closing:string};
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

// export interface IBookings extends Document {
export interface IBookings extends Document {
    userId:Types.ObjectId;
    shopId:Types.ObjectId;
    shedule:{date:string;time:string};
    vehicleDetails:{make:string,model:string;year:string;description?:string};
    userDetails:{
        firstName:string;
        lastName:string;
        email:string;
        phoneNumber:string;
    };
    amount:number;
    repairWork?:string;
    locationdetails?:{
        description:string;
        coordinates:[number,number];
    };
    paymentStatus:paymentStatus;
    paymentFailDetails?:{
        reason:string,
        actionFrom:'user' | 'shop'
    };
    status: pickupStatus;
    createdAt?:Date;
}

export type paymentStatus = 'PAID'|'PENDING'|'FAILED' | 'REFUNDED';
export type pickupStatus = 'PENDING' | 'CONFIRMED'  | 'COMPLETED' | 'CANCELLED';




export interface AuthenticatedRequest extends Request { user?: string | JwtPayload; }
