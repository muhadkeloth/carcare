import mongoose, { Schema } from "mongoose";
import { IMessage } from "../utils/interface";


const messageSchema:Schema<IMessage> = new Schema(
    {
        chatId:{
            type:Schema.Types.ObjectId,
            ref:'Chat'
        },
        senderId:String,
        message:String,
        image:String,
    },{
        timestamps:true
    }
)

const messageModel = mongoose.model<IMessage>("Message",messageSchema)

export default messageModel;