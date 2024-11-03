import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
     username:string;
     phoneNumber:string;
     numberValidate:boolean;
     email:string;
     emailValidate:boolean;
     password:string;
     isActive:boolean;
     role:'user' | 'admin';
     otp?: string;
     otpExpiry?:Date;
     createdAt?:Date;
}

const UserSchema:Schema = new Schema(
    {
        username: { type:String, required: true },
        phoneNumber: { type:String, required: true, unique: true },
        numberValidate: { type:Boolean, required:true, default: false },
        email: { type:String, required: true, unique: true },
        emailValidate: { type:Boolean, required:true, default: false },
        password: { type:String, required: true },
        isActive: { type:Boolean, required:true, default: true },
        role: { type:String, required:true, default: 'user' },
        otp: { type: String },
        otpExpiry:{ type: Date },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);


const User = mongoose.model<IUser>("User",UserSchema);
export default User;

