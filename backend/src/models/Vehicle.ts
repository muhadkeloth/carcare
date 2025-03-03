import mongoose, { Schema } from "mongoose";
import { IVehicle } from "../utils/interface";



const VehicleSchema: Schema<IVehicle> = new Schema(
    {
        brand: { type: String, required: true },
        vehicleModel: { type: String, required: true, unique: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);

export default Vehicle;
