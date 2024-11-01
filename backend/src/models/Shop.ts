import mongoose, { Document, Schema } from "mongoose";

export interface Shop extends Document {
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
        latitude:number;
        longitude:number;
    };
    image:string;
    createdAt?:Date;
}

const ShopSchema:Schema = new Schema(
    {
        shopName: { type:String, required: true },
        ownerName: { type:String, required: true },
        phoneNumber: { type:String, required: true, unique: true },
        email: { type:String, required: true, unique: true },
        password: { type:String },
        isActive: { type:Boolean, required:true, default: true },
        otp: { type: String },
        otpExpiry:{ type: Date },               
        address:{
            street: {type:String,required:true},
            city: {type:String,required:true},
            state: {type:String,required:true},
            country: {type:String,required:true},
            pincode: {type:String,required:true},
        },
        location:{
            latitude:{type:Number,required:true},
            longitude:{type:Number,required:true}
        },
        image:{type:String,required:true},
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);


const Shop = mongoose.model<Shop>("Shop",ShopSchema);
export default Shop;

