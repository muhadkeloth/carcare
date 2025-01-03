import mongoose, { Schema } from "mongoose";
import {IChat} from "../utils/interface"

const chatSchema: Schema<IChat> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required:true,
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model<IChat>("Chat",chatSchema);

export default chatModel