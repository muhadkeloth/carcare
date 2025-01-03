import mongoose, { Schema } from "mongoose";
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
        vehicleIds: [{
            brand: {type:String,required:true},
            vehicleModelIds:[{type:Schema.Types.ObjectId,ref:"Vehicle"}],
        }] ,
        estimate:[{
            work:{type:String,unique:true},
            priceStart:{type:Number,required:true},
            priceEnd:{type:Number,required:true}
        }],
        rating:{ratingSum:{type:Number},count:{type:Number}},
        about:{type:String },
        discription:{title:{type:String},discript:{type:String}},
        workingTime:{opening:{type:String,default:'09:00'},closing:{type:String,default:'17:00'}},

        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

ShopSchema.index({ location:"2dsphere"});

const Shop = mongoose.model<IShop>("Shop",ShopSchema);
export default Shop;
