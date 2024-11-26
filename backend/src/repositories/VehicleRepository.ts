import Vehicle from "../models/Vehicle";
import { IVehicle } from "../utils/interface";
import BaseRepository from "./BaseRepository";


export default class VehicleRepository extends BaseRepository<IVehicle> {

    constructor(vehicleModel: typeof Vehicle){
        super(vehicleModel);
    }
    
    async findVehicles(skip:number, limit:number):Promise<any[] | null>{
        const vehicles = await this.model.aggregate([
            { $sort:{createdAt:-1} },
            { $group:{ _id:'$brand', vehicleModel:{ $push:"$vehicleModel" } } },
            { $skip: skip },
            { $limit:limit }
        ])
        if(!vehicles) return null;
        return vehicles.map(({_id:brand, vehicleModel}) => ({brand,vehicleModel}));
    }

    async findAllVehicles():Promise<any[] |null>{
        const vehicles = await this.model.aggregate([
            { $sort:{createdAt:-1} },
            { $group:{ _id:'$brand', vehicleModel:{ $push:"$vehicleModel" } } },
        ])
        if(!vehicles) return null;
        return vehicles.map(({_id:brand, vehicleModel}) => ({brand,vehicleModel}));
    }

    async findCountVehicles(): Promise<number | null> {
        // return await this.model.countDocuments();
        const allVehicles =  await this.findAllVehicles();
        return allVehicles?.length || null ;
    }
    // edit to count

    async findVehiclesByBrand(brand:string):Promise<IVehicle[] | null>{
        return await this.model.find({brand})
    }

    async deleteVehiclesNotInModels(brand:string,vehicleModel:string[]):Promise<void>{
        await this.model.deleteMany({brand, vehicleModel:{$nin:vehicleModel}})
    }

    async deleteVehicleByBrand(brand:string):Promise<void> {
        await this.model.deleteMany({brand})
    }

    


}

