import { ObjectId } from "mongoose";
import VehicleRepository from "../repositories/VehicleRepository";
import BaseService from "./BaseService";
import { HttpStatusCode, IVehicle } from "../utils/interface";
import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";


export default class VehicleService extends BaseService<IVehicle> {

    constructor(protected repository: VehicleRepository) {
        super(repository);
    };

    async findVehicles(skip:number,limit:number):Promise<any[] |null >{
        return await this.repository.findVehicles(skip,limit);
    }

    async findAllVehicles():Promise<any[] |null >{
        return await this.repository.findAllVehicles();
    }

    async findCountVehicles():Promise<number | null>{
        return await this.repository.findCountVehicles();
    }

    async createVehicle(brand:string, vehicleModel:string[]):Promise<void> {
        if (!brand || vehicleModel.length ==0 ) {
            logger.warn('Invalid vehicle details')
            throw new AppError("Invalid vehicle details",HttpStatusCode.BAD_REQUEST);
        }

        for(const model of vehicleModel){
            let vehicle = await this.repository.findOne({brand,vehicleModel:model});
            if(!vehicle){
                vehicle = await this.repository.create({brand,vehicleModel:model})
            }
        }
    }

    async editVehicle(brand:string,vehicleModel:string[]):Promise<any | null>{
        if (!brand || vehicleModel.length ==0 ) {
            logger.warn('Invalid vehicle details')
            throw new AppError("Invalid vehicle details",HttpStatusCode.BAD_REQUEST);
        }
        const existingVehicles = await this.repository.findVehiclesByBrand(brand);

        const existingModels = existingVehicles.map((v) => v.vehicleModel );
        const modelsToAdd = vehicleModel.filter((v)=> !existingModels.includes(v) );

        if(modelsToAdd.length > 0){
            const vehicleToCreate = modelsToAdd.map((model) => ({
                brand,vehicleModel:model
            }));

            await this.repository.createMany(vehicleToCreate)
        }

        await this.repository.deleteVehiclesNotInModels(brand,vehicleModel)
        const updatedVehicle =  await this.repository.findVehiclesByBrand(brand);
        if(!updatedVehicle) return null;
        return { brand,
                 vehicleModel:updatedVehicle.map(vehicle => vehicle.vehicleModel),
        }
    }

    async deleteByBrand(brand:string):Promise<void> {
        await this.repository.deleteVehicleByBrand(brand)
    }

    // async findVehicles(skip:number,limit:number):Promise<any[]>{
    //     const skip = (page -1) * limit;
    //     const vehicles = await VehicleRepository.findVehiclesByIds(vehicleIds,skip,limit);

    //     const totalCount = await VehicleRepository.countVehiclesByIds(vehicleIds);
    //     const totalPages = Math.ceil(totalCount / limit);
    //     return {vehicles, totalPages}
    // }



}
