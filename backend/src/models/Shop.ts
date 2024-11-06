import mongoose, { Document, Schema } from "mongoose";

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
        // latitude:number;
        // longitude:number;
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
            street: {type:String},
            city: {type:String},
            state: {type:String},
            country: {type:String},
            pincode: {type:String},
        },
        location:{
            type:{type:String,enum:["Point"], required: true },
            coordinates:{
                type:[Number],
                required:true,
            },
            // latitude:{type:Number,required:true},
            // longitude:{type:Number,required:true}
        },
        image:{type:String,required:true},
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

ShopSchema.index({ location:"2dsphere"});

const Shop = mongoose.model<IShop>("Shop",ShopSchema);
export default Shop;

