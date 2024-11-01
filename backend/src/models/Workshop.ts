import mongoose, { Document, Schema } from "mongoose";

export interface Shop extends Document {
     name:string;
     phoneNumber:string;
     address:string;
     isActive:boolean;
     role:'user' | 'admin' | 'workshop';
     otp?: string;
     otpExpiry?:Date;
     createdAt?:Date;
}

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
    },
    { timestamps: true }
);


const User = mongoose.model<Shop>("User",UserSchema);
export default User;

