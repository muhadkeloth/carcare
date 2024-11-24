import Vehicle from "../models/Vehicle";
import { IVehicle } from "../utils/interface";


class VehicleRepository{
    async findVehiclesByIds(vehicleIds:any[], skip:number, limit:number){
        return  await Vehicle.find({_id:{$in:vehicleIds}})
                .sort({createdAt:-1}).skip(skip)
                .limit(limit).lean();
    }

    async countVehiclesByIds(vehicleIds: any[]): Promise<number> {
        return Vehicle.countDocuments({ _id: { $in: vehicleIds } });
    }

    


}

export default new VehicleRepository();