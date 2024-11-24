import { ObjectId } from "mongoose";
import VehicleRepository from "../repositories/VehicleRepository";



class VehicleService {

    async getVehicles(vehicleIds:any[],page:number,limit:number){
        const skip = (page -1) * limit;
        const vehicles = await VehicleRepository.findVehiclesByIds(vehicleIds,skip,limit);

        const totalCount = await VehicleRepository.countVehiclesByIds(vehicleIds);
        const totalPages = Math.ceil(totalCount / limit);
        return {vehicles, totalPages}
    }



}

export default new VehicleService();