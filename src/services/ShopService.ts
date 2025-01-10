import { Types } from "mongoose";
import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import ShopRepository from "../repositories/ShopRepository";
import { HttpStatusCode, IShop, IVehicle } from "../utils/interface";
import BaseService from "./BaseService";




export default class ShopService extends BaseService<IShop> {

        constructor(protected repository: ShopRepository) {
            super(repository);
        };
        
        async updateById(id:string, updateData:any):Promise<IShop> {
            const updateddata = await this.repository.updateById(id, updateData);
            if(!updateddata){
                logger.error('Shop not found or update failed');
                throw new AppError("Shop not found or update failed", HttpStatusCode.NOT_FOUND);
            }
            return updateddata;
        }

        async findNearbyShops(latitude:number,longitude:number,radiusInKm:number,limit:number):Promise<IShop[] | null>{
            return await this.repository.findNearbyShops(latitude,longitude,radiusInKm,limit)
        }
        // async findNearbyShops(latitude:number,longitude:number,query:any,skip:number,limit:number):Promise<IShop[] | null>{
        //     return await this.repository.findNearbyShops(latitude,longitude,query, skip, limit)
        // }

        
        async findShopDetailsById(id:string):Promise<IShop | null>{
                return await this.repository.findShopById(id);        
            }


        async findShops(skip:number,limit:number):Promise<IShop[] | null>{
            return await this.repository.findShops(skip,limit);
        }

        async findRandomShops(limit:number):Promise<IShop[] | null>{
            return await this.repository.findRandomShops(limit);
        }

        async findCountShops():Promise<number | null>{
            return await this.repository.findCountShops();
          }

        async toggleStatus(id: string):Promise<IShop>{
            const shop = await this.repository.toggleStatusById(id);
            if(!shop){
                logger.error('shop not found')
                throw new AppError('shop not found',HttpStatusCode.NOT_FOUND);
            } 
  
            return shop
        }

        // async createVehicle(shopId:string,vehicledetails:IVehicle[] ,vehicleModel:string[]):Promise<void>{
        //     if (shopId.length == 0 || vehicledetails.length == 0 || vehicleModel.length == 0 ) {
        //         logger.warn('Invalid vehicle details')
        //         throw new AppError("Invalid vehicle details",HttpStatusCode.BAD_REQUEST);
        //     }

        //     const shopUser = await this.repository.findShopById(shopId);
        //     if(!shopUser){
        //         logger.warn("Shop not found");
        //         throw new AppError("Shop not found", HttpStatusCode.NOT_FOUND);
        //     }

        //     if(!shopUser.vehicleIds) shopUser.vehicleIds = [];

        //     const brand = vehicledetails[0].brand;
            
        //     const vehicleModelIds = vehicledetails.filter(v => vehicleModel.includes(v.vehicleModel) ).map(v => new Types.ObjectId(v._id));

        //     const exisitingBrand = shopUser.vehicleIds.find((v) => v.brand === brand);
        //     if(exisitingBrand){
        //         exisitingBrand.vehicleModelIds = [...new Set([...exisitingBrand.vehicleModelIds, ...vehicleModelIds ])];
        //     }else{
        //         shopUser.vehicleIds.push({ brand, vehicleModelIds, })
        //     };
        //     await shopUser.save();
            
        //     logger.info(`Vehicle details updated for shop: ${shopId}`);
        // }
        async createVehicle(shopId:string,brand:string ,vehicleModel:string[]):Promise<void>{
            if (shopId.length == 0 || brand.length == 0 || vehicleModel.length == 0 ) {
                logger.warn('Invalid vehicle details')
                throw new AppError("Invalid vehicle details",HttpStatusCode.BAD_REQUEST);
            }

            const shopUser = await this.repository.findShopById(shopId);
            if(!shopUser){
                logger.warn("Shop not found");
                throw new AppError("Shop not found", HttpStatusCode.NOT_FOUND);
            }

            if(!shopUser.vehicleIds) shopUser.vehicleIds = [];            
            // const vehicleModelIds = vehicledetails.filter(v => vehicleModel.includes(v.vehicleModel) ).map(v => new Types.ObjectId(v._id));

            const exisitingBrand = shopUser.vehicleIds.find((v) => v.brand === brand);
            if(exisitingBrand){
                exisitingBrand.vehicleModel = [...new Set(vehicleModel)];
            }else{
                shopUser.vehicleIds.push({ brand, vehicleModel })
            };
            await shopUser.save();
            
            logger.info(`Vehicle details updated for shop: ${shopId}`);
        }

        async findVehicles(_id:string,skip:number,limit:number):Promise<any |null >{
            const shop =  await this.repository.findVehicles(_id);
            if(!shop || !shop.vehicleIds) return null;
            // const vehicles = shop.vehicleIds.map(vehicle => ({
            //     brand:vehicle.brand,
            //     vehicleModel:vehicle.vehicleModelIds.map((v:any) => v.vehicleModel)
            // }));
            console.log('shop in shop service fnd vehicle',shop)
            const vehicles = shop.vehicleIds;
            const totalVehicles = vehicles.length;
            const paginatedVehicles = vehicles.slice(skip,skip + limit);

            return {Vehicle:paginatedVehicles, totalVehicles}
        }

        // async updateVehilce(shopId:string,vehicledetails:IVehicle[] ,vehicleModel:string[]):Promise<any | null> {
        //     if (shopId.length == 0 || vehicledetails.length == 0 || vehicleModel.length == 0 ) {
        //         logger.warn('Invalid vehicle details')
        //         throw new AppError("Invalid vehicle details",HttpStatusCode.BAD_REQUEST);
        //     }

        //     const shopUser = await this.repository.findShopById(shopId);
        //     if(!shopUser){
        //         logger.warn("Shop not found");
        //         throw new AppError("Shop not found", HttpStatusCode.NOT_FOUND);
        //     }

        //     if(!shopUser.vehicleIds) shopUser.vehicleIds = [];

        //     const brand = vehicledetails[0].brand;
        //     const vehicleModelIds = vehicledetails.filter(v => vehicleModel.includes(v.vehicleModel) ).map(v => new Types.ObjectId(v._id));

        //     const exisitingBrand = shopUser.vehicleIds.find((v) => v.brand === brand);
        //     if(exisitingBrand){
        //         exisitingBrand.vehicleModelIds = vehicleModelIds;
        //     }else{
        //         shopUser.vehicleIds.push({ brand, vehicleModelIds, })
        //     };
        //     await shopUser.save();
            
        //     logger.info(`Vehicle details updated for shop: ${shopId}`);
        //     return {brand,vehicleModel}
        // }
        async updateVehilce(shopId:string,brand:string ,vehicleModel:string[]):Promise<any | null> {
            if (shopId.length == 0 || brand.length == 0 || vehicleModel.length == 0 ) {
                logger.warn('Invalid vehicle details')
                throw new AppError("Invalid vehicle details",HttpStatusCode.BAD_REQUEST);
            }

            const shopUser = await this.repository.findShopById(shopId);
            if(!shopUser){
                logger.warn("Shop not found");
                throw new AppError("Shop not found", HttpStatusCode.NOT_FOUND);
            }

            if(!shopUser.vehicleIds) shopUser.vehicleIds = [];

            // const brand = vehicledetails[0].brand;
            // const vehicleModelIds = vehicledetails.filter(v => vehicleModel.includes(v.vehicleModel) ).map(v => new Types.ObjectId(v._id));

            const exisitingBrand = shopUser.vehicleIds.find((v) => v.brand === brand);
            if(exisitingBrand){
                exisitingBrand.vehicleModel = [...new Set(vehicleModel)];
            }else{
                shopUser.vehicleIds.push({ brand,vehicleModel, })
            };
            await shopUser.save();
            
            logger.info(`Vehicle details updated for shop: ${shopId}`);
            return {brand,vehicleModel}
        }

        async deleteVehicleByBrand(shopId:string,brand:string):Promise<void>{
            const shopUser = await this.repository.findShopById(shopId);
            if(!shopUser){
                logger.warn("Shop not found");
                throw new AppError("Shop not found", HttpStatusCode.NOT_FOUND);
            }
            if(!shopUser.vehicleIds) shopUser.vehicleIds = [];

            shopUser.vehicleIds = shopUser.vehicleIds.filter((v) => v.brand !== brand);
            await shopUser.save();
            
            logger.info(`Vehicle details deleted for shop: ${shopId}`);
        }

        async findEstimate(_id:string,skip:number,limit:number):Promise<any |null >{
            const shop =  await this.repository.findShopById(_id);
            if(!shop || !shop.estimate) return null;

            const totalEstimate = shop.estimate.length;
            const paginatedEstimate = shop.estimate.slice(skip,skip + limit);

            return {Estimate:paginatedEstimate, totalEstimate}
        }

        async createEstimate(shopId:string,work:string, priceStart:number, priceEnd:number):Promise<void> {
            if (shopId.length == 0 || work.length == 0 || !priceStart || !priceEnd ) {
                logger.warn('Invalid estimate details')
                throw new AppError("Invalid estimate details",HttpStatusCode.BAD_REQUEST);
            }

            const shopUser = await this.repository.findShopById(shopId);
            if(!shopUser){
                logger.warn("Shop not found");
                throw new AppError("Shop not found", HttpStatusCode.NOT_FOUND);
            }

            if(!shopUser.estimate) shopUser.estimate = [];
            
            let exisitingWork = shopUser.estimate.find((v) => v.work === work);
            if(exisitingWork){
                exisitingWork.priceStart = priceStart;
                exisitingWork.priceEnd = priceEnd;
            }else{
                shopUser.estimate.push({ work, priceStart, priceEnd })
            };
            await shopUser.save();
            
            logger.info(`estimate details updated for shop: ${shopId}`);
        }

        async updateEstimate(shopId:string,work:string, priceStart:number, priceEnd:number ):Promise<any | null> {
            if (shopId.length == 0 || work.length == 0 || !priceStart || !priceEnd ) {
                logger.warn('Invalid estimate details')
                throw new AppError("Invalid estimate details",HttpStatusCode.BAD_REQUEST);
            }

            const shopUser = await this.repository.findShopById(shopId);
            if(!shopUser){
                logger.warn("Shop not found");
                throw new AppError("Shop not found", HttpStatusCode.NOT_FOUND);
            }

            if(!shopUser.estimate) shopUser.estimate = [];

            const exisitingWork = shopUser.estimate.find((v) => v.work === work);
            if(exisitingWork){
                exisitingWork.priceStart = priceStart;
                exisitingWork.priceEnd = priceEnd;
            }else{
                shopUser.estimate.push({ work, priceStart, priceEnd })
            };
            await shopUser.save();
            
            logger.info(`estimate details updated for shop: ${shopId}`);
            return {work,priceStart,priceEnd }
        }

        async deleteEstimateByWork(shopId:string,work:string):Promise<void>{
            const shopUser = await this.repository.findShopById(shopId);
            if(!shopUser){
                logger.warn("Shop not found");
                throw new AppError("Shop not found", HttpStatusCode.NOT_FOUND);
            }
            if(!shopUser.estimate) shopUser.estimate = [];

            shopUser.estimate = shopUser.estimate.filter((v) => v.work !== work);
            await shopUser.save();
            
            logger.info(`estimate details deleted for shop: ${shopId}`);
         }

         async findShopPincodeByFilter(pincode:string):Promise<string[] | null>{
            const filteredPincode = await this.repository.findShopPincodeByFilter(pincode);
            if(!filteredPincode ) return null;

            return [...new Set(filteredPincode.map(doc => doc.address.pincode))]
        }

         async findFilterShopByPincode(pincode:string):Promise<IShop[] | null>{
            return await this.repository.findByPincode(pincode);
        }

        async updateRating(_id:any,rating:number):Promise<IShop | null>{
            const shopdoc = await this.repository.findOne({_id})
            if(!shopdoc){
                logger.warn("Shop not found");
                throw new AppError("Shop not found", HttpStatusCode.NOT_FOUND);
            }
            if(!shopdoc?.rating || !shopdoc?.rating?.ratingSum){
                shopdoc.rating = {ratingSum:rating,count:1};
            }else{
                shopdoc.rating.ratingSum += rating;
                shopdoc.rating.count++;
            }
            return await shopdoc.save()
        }
    

 


}

