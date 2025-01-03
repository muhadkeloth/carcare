import mongoose, { Schema } from "mongoose";
import { IUser } from "../utils/interface";



const UserSchema:Schema = new Schema(
    {
        username: { type:String, required: true },
        phoneNumber: { type:String, required: true, unique: true },
        email: { type:String, required: true, unique: true },
        password: { type:String, required: true },
        isActive: { type:Boolean, required:true, default: true },
        role: { type:String, required:true, default: 'user' },
        otp: { type: String },
        otpExpiry:{ type: Date },
        createdAt: { type: Date, default: Date.now },
        image:{type:String},
    },
    { timestamps: true }
);


const User = mongoose.model<IUser>("User",UserSchema);
export default User;

