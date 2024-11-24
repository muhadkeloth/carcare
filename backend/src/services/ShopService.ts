import { AppError } from "../middleware/errorHandler";
import logger from "../middleware/logger";
import ShopRepository from "../repositories/ShopRepository";
import { HttpStatusCode, IShop } from "../utils/interface";
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

        
        async findShopDetailsById(id:string):Promise<IShop | null>{
                return await this.repository.findShopById(id);        
            }


        async findShops(skip:number,limit:number):Promise<IShop[] | null>{
            return await this.repository.findShops(skip,limit);
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

  



 


}

