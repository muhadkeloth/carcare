import mongoose, { Document, Schema, Types } from "mongoose";
import { IShop } from "../utils/interface";



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
        },
        image:{type:String,required:true},
        vehicleIds:[{type:Schema.Types.ObjectId,ref:"Vehicle"}],

        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

ShopSchema.index({ location:"2dsphere"});

const Shop = mongoose.model<IShop>("Shop",ShopSchema);
export default Shop;

