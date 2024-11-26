import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AppError } from "../middleware/errorHandler";
import { AuthenticatedRequest, HttpStatusCode } from "../utils/interface";
import Vehicle from "../models/Vehicle";
import mongoose from "mongoose";
import ShopService from "../services/ShopService";
import VehicleService from "../services/VehicleService";
import BaseController from "./BaseController";
import logger from "../middleware/logger";
import VehicleRepository from "../repositories/VehicleRepository";

export class ShopController extends BaseController<any> {
  protected vehicleService: VehicleService;

  constructor(protected service: ShopService) {
    super(service);
    const vehicleRepository = new VehicleRepository(Vehicle)
    this.vehicleService = new VehicleService(vehicleRepository);
  }

  getAllvehicleDetails = async (req:Request,res:Response,next:NextFunction) => {
    try {
      const Vehicle = await this.vehicleService.findAllVehicles();

      res.status(HttpStatusCode.SUCCESS).json({ Vehicle });
    } catch (error) {
        const err = error as Error;
        logger.error(`error fetching vehicle details in shop: ${err.message}`);
        next(err);
    }
  }

  getvehicleDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const {Vehicle, totalVehicles} = await this.service.findVehicles(req.user as string,skip,limit);

      res.status(HttpStatusCode.SUCCESS).json({ Vehicle, totalPages: Math.ceil(totalVehicles/limit), currentPage: page });
    } catch (error) {
        const err = error as Error;
        logger.error(`error fetching vehicle details in shop: ${err.message}`);
        next(err);
    }
  };

  addVehicleDetails = async (req: AuthenticatedRequest, res: Response,next: NextFunction) => {
    try {
      if (!req.user){
              logger.warn(`error to find shop id`);
              throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
            }
      const { brand, vehicleModel } = req.body;

      const vehicledetails = await this.vehicleService.findVehiclesByBrand(brand);
      if (!vehicledetails){
        logger.warn('failed to create or find vehicle');
        throw new AppError("failed to create or find vehicle ",HttpStatusCode.INTERNAL_SERVER_ERROR);
      }

      await this.service.createVehicle(req.user as string, vehicledetails, vehicleModel); 
    
      res.status(HttpStatusCode.CREATED).json({ message: "Vehicle shop added successfully" });

    } catch (error) {
        const err = error as Error;
        logger.error(`Error adding vehicle details: ${err.message}`);
        next(err);
    }
  };

  editVehicleDetails = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const { brand, vehicleModel } = req.body;
      const vehicledetails = await this.vehicleService.findVehiclesByBrand(brand);
      if (!vehicledetails){
        logger.warn('failed to create or find vehicle');
        throw new AppError("failed to create or find vehicle ",HttpStatusCode.INTERNAL_SERVER_ERROR);
      }

      const vehicleupload = await this.service.updateVehilce(req.user as string,vehicledetails, vehicleModel); 
      res.status(HttpStatusCode.CREATED).json({ vehicle:vehicleupload, message: "update vehicle details successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating vehicle details: ${err.message}`);
        next(err);
    }
  };


  deleteVehicleDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const brand = req.params.brand;
      if (!brand){
        logger.warn("vehicle brand is required for deletion ");
        throw new AppError("vehicle brand is required for deletion ",HttpStatusCode.BAD_REQUEST);
      }

      await this.service.deleteVehicleByBrand(req.user as string,brand);

      res.status(HttpStatusCode.SUCCESS).json({message: "Vehicle deleted and updated successfully"});
    } catch (error) {
        const err = error as Error;
        logger.error(`Error delete vehicle details: ${err.message}`);
        next(err);
    }
  };


  shopDetails = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('User not found or authenticated');
        throw new AppError("Error: User not found or authenticated",HttpStatusCode.BAD_REQUEST);
      }
      const shopUser = await this.service.findOne({ _id: req.user as string });
      if (!shopUser){
        logger.warn('shop user not found in backend');
        throw new AppError("shop user not found in backend",HttpStatusCode.NOT_FOUND);
      }

      res.status(HttpStatusCode.SUCCESS).json({ shopUser, message: "shop User find successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error finding shopuser details: ${err.message}`);
        next(err);
    }
  };

  uploadShopProfileImg = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.file){
        logger.warn('file required')
        throw new AppError("upload shop image file not found",HttpStatusCode.BAD_REQUEST);
      }
      const imagePath = req.file.path;

      res.status(HttpStatusCode.CREATED).json({ imagePath, message: "image uploaded successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error upload shop profile image: ${err.message}`);
        next(err);
    }
  };

  updateShopProfileDetails = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('update shop details shop id not found')
        throw new AppError("update shop details shop id not found",HttpStatusCode.BAD_REQUEST);
      }
      const { shopName, ownerName, phoneNumber, about, location, image } =req.body;

      const updatedShop = await this.service.updateById(req.user as string, {
        shopName,ownerName,
        phoneNumber,about,
        location,image,
      });

      res.status(HttpStatusCode.CREATED).json({ success: true, shop: updatedShop });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating shop profile details: ${err.message}`);
        next(err);
    }
  };

  updateShopProfilepassword = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('password change error, shop id not found')
        throw new AppError("password change error, shop id not found",HttpStatusCode.BAD_REQUEST);
      }
      const { currentPassword, newPassword } = req.body;

      const shopdetails = await this.service.findOne({_id: req.user as string,});
      if (!shopdetails){
        logger.warn('shop details not found ')
        throw new AppError("shop details not found ", HttpStatusCode.NOT_FOUND);
      }
      if (shopdetails?.password) {
        await this.service.validatePassword(currentPassword,shopdetails.password,"password");

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        shopdetails.password = hashedNewPassword;
        await shopdetails.save(); //update here

        res.status(HttpStatusCode.CREATED).json({ success: true, message: "password updated successfully" });
      } else{
        logger.warn('password not found')
        throw new AppError("password not found ", HttpStatusCode.NOT_FOUND);
      }
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating shop profile password: ${err.message}`);
        next(err);
    }
  };

  getEstimateDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const {Estimate, totalEstimate} = await this.service.findEstimate(req.user as string,skip,limit);

      res.status(HttpStatusCode.SUCCESS).json({ Estimate, totalPages: Math.ceil(totalEstimate/limit), currentPage: page });
    } catch (error) {
        const err = error as Error;
        logger.error(`error fetching vehicle details in shop: ${err.message}`);
        next(err);
    }
  };

  createEstimate = async(req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('shop id not found')
        throw new AppError("shop id not found",HttpStatusCode.BAD_REQUEST);
      }
      const { work, priceStart, priceEnd } = req.body;

      await this.service.createEstimate(req.user as string, work, priceStart, priceEnd); 
    
      res.status(HttpStatusCode.CREATED).json({ message: "estmate shop added successfully" });

    } catch (error) {
        const err = error as Error;
        logger.error(`Error create shop estimate: ${err.message}`);
        next(err);
    }
  }

  editEstimateDetails = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const { work, priceStart, priceEnd } = req.body;

      const estimateupload = await this.service.updateEstimate(req.user as string,work, priceStart, priceEnd); 
 
      res.status(HttpStatusCode.CREATED).json({ Estimate:estimateupload, message: "update estimate details successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating vehicle details: ${err.message}`);
        next(err);
    }
  };


  deleteEstimateDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const work = req.params.work;
      if (!work){
        logger.warn("estimate work is required for deletion ");
        throw new AppError("estimate work is required for deletion ",HttpStatusCode.BAD_REQUEST);
      }

      await this.service.deleteEstimateByWork(req.user as string,work);

      res.status(HttpStatusCode.SUCCESS).json({message: "Vehicle deleted and updated successfully"});
    } catch (error) {
        const err = error as Error;
        logger.error(`Error delete vehicle details: ${err.message}`);
        next(err);
    }
  };










}
