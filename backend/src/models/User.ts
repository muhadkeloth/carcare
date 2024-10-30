import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
     username:string;
     email:string;
     password:string;
     role:'user' | 'admin' | 'workshop';
     createdAt?:Date;
}

const UserSchema:Schema = new Schema(
    {
        username: { type:String, required: true },
        email: { type:String, required: true, unique: true },
        password: { type:String, required: true },
        role: { type:String, required:true, default: 'user' },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User",UserSchema);
export default User;

