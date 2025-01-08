// import mongoose, { Schema } from "mongoose";
// import { IEstimate } from "../utils/interface";



// const EstimateSchema: Schema<IEstimate> = new Schema(
//     {
//         work: { type: String, required: true, unique: true },
//         details:[
//             { 
//                 price: {type:Number, required: true },
//                 vehicles: [{type: Schema.Types.ObjectId, ref:"Vehilce"}]
//              },
//         ] ,
//         createdAt: { type: Date, default: Date.now },
//     },
//     { timestamps: true }
// );

// const Estimate = mongoose.model<IEstimate>("Estimate", EstimateSchema);

// export default Estimate;
