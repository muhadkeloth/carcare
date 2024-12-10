import mongoose, { Document, Schema } from "mongoose";
import { IBookings } from "../utils/interface";



const PickupsSchema: Schema<IBookings> = new Schema(
    {
        userId:{type:Schema.Types.ObjectId,ref:"User"},
        shopId:{type:Schema.Types.ObjectId,ref:"Shop"},
        shedule:{
            date:{type:String},
            time:{type:String},
        },
        vehicleDetails:{
            make:{type:String},
            model:{type:String},
            year:{type:String},
            description:{type:String},
        },
        userDetails:{
            firstName:{type:String},
            lastName:{type:String},
            email:{type:String},
            phoneNumber:{type:String},
        },
        amount:{type:Number},
        locationdetails:{
            description:{type:String},
            coordinates:[{type:Number}],
        },
        paymentStatus:{type:String},
        paymentFailDetails:{
            reason:{type:String},
            actionFrom:{type:String}
        },
        status:{type:String,default:'PENDING'},
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Pickups = mongoose.model<IBookings>("Pickups", PickupsSchema);

export default Pickups;
