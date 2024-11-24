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

export class ShopController extends BaseController<any> {
  constructor(protected service: ShopService) {
    super(service);
  }

  vehicleDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const shopdetails = await this.service.findOne({_id: req.user as string,});
      if (!shopdetails){
        logger.warn(`finding shop vehicle details error`);
        throw new AppError("finding shop vehicle details error",HttpStatusCode.NOT_FOUND);
      }

      const vehicleIds = shopdetails?.vehicleIds;
      if (!vehicleIds || vehicleIds.length == 0) {
        res.status(HttpStatusCode.SUCCESS).json({ shopVehicle: [], totalPages: 1, currentPage: page });
      } else {
        const { vehicles, totalPages } = await VehicleService.getVehicles(vehicleIds,page,limit); //need edit
        logger.info("fetch vehicle details successfully");

        res.status(HttpStatusCode.SUCCESS).json({ shopVehicle: vehicles, totalPages, currentPage: page });}
    } catch (error) {
        const err = error as Error;
        logger.error(`error fetching vehicle details in shop: ${err.message}`);
        next(err);
    }
  };

  addVehicleDetails = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const { brand, vehicleModel, year } = req.body;

      if (!brand || !vehicleModel || !year || !Array.isArray(year)) {
        logger.warn('Invalid vehicle details')
        throw new AppError("Invalid vehicle details",HttpStatusCode.BAD_REQUEST);
      }
      let vehicle = await Vehicle.findOne({ brand, vehicleModel }); //edit vehilc
      if (!vehicle) {
        vehicle = await Vehicle.create({ brand, vehicleModel, year }); //edit vehilc
      } else {
        const newYears = year.filter((y) => !vehicle?.year.includes(y));
        if (newYears.length > 0) {
          vehicle.year.push(...newYears);
          await vehicle.save(); //edit vehilc
        }
      }
      if (!vehicle){
        logger.warn('failed to create or find vehicle');
        throw new AppError("failed to create or find vehicle ",HttpStatusCode.INTERNAL_SERVER_ERROR);
      }

      const shopUser = await this.service.findOne({ _id: req.user as string });
      if (!shopUser){
        logger.warn('shop user not found');
        throw new AppError("shop user not found", HttpStatusCode.SUCCESS);
      }

      let vehicleId = vehicle._id as mongoose.Types.ObjectId;
      if (shopUser.vehicleIds && !shopUser.vehicleIds.some((id) => id.toString() === vehicleId.toString())) {
        shopUser.vehicleIds.push(vehicleId);
        await shopUser.save(); //need edit here
      }

      res.status(HttpStatusCode.CREATED).json({ message: "Vehicle added successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error adding vehicle details: ${err.message}`);
        next(err);
    }
  };

  EditVehicleDetails = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn("Error: User not found or authenticated");
        throw new AppError("Error: User not found or authenticated",HttpStatusCode.BAD_REQUEST);
      }
      const vehicleId = req.params.id;
      if (!vehicleId){
        logger.warn("vehicle id is required");
        throw new AppError("vehicle id is required",HttpStatusCode.BAD_REQUEST);
      }

      const { brand, vehicleModel, year } = req.body;
      if (!brand || !vehicleModel || !year || !Array.isArray(year) || !year.every((item) => typeof item === "number")) {
        logger.warn("Invalid vehicle details");
        throw new AppError("Invalid vehicle details",HttpStatusCode.BAD_REQUEST);
      }

      const vehicleupload = await Vehicle.findById(vehicleId); //edit vehicle
      if (!vehicleupload){
        logger.warn("vehicle not found");
        throw new AppError("vehicle not found", HttpStatusCode.NOT_FOUND);
      }

      vehicleupload.brand = brand;
      vehicleupload.vehicleModel = vehicleModel;
      vehicleupload.year = [1];
      vehicleupload.year.push(...year);
      vehicleupload.year.shift();

      const vehicle = await vehicleupload.save(); //edit vehicle

      res.status(HttpStatusCode.CREATED).json({ vehicle, message: "update vehicle details successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating vehicle details: ${err.message}`);
        next(err);
    }
  };

  deleteVehicleDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn("User not found or authenticateds");
        throw new AppError("Error: User not found or authenticated",HttpStatusCode.BAD_REQUEST);
      }
      const vehicleId = req.params.id;
      if (!vehicleId){
        logger.warn("vehicle id is required for deletion ");
        throw new AppError("vehicle id is required for deletion ",HttpStatusCode.BAD_REQUEST);
      }

      const vehicle = await Vehicle.findByIdAndDelete(vehicleId); //edit vehicle
      if (!vehicle){
        logger.warn("vehicle not found");
        throw new AppError("vehicle not found", HttpStatusCode.NOT_FOUND);
      }

      const shop = await this.service.findOne({ _id: req.user as string });
      if (!shop){
        logger.warn("shopid not found to delete vehicle");
        throw new AppError("shopid not found to delete vehicle",HttpStatusCode.NOT_FOUND);
      }

      const vehicleIndex = shop?.vehicleIds
        ? shop?.vehicleIds.indexOf(new mongoose.Types.ObjectId(vehicleId))
        : -1;
      if (vehicleIndex !== -1 && shop?.vehicleIds) {
        shop?.vehicleIds.splice(vehicleIndex, 1);
        await shop.save(); //edit shop
      }

      res.status(HttpStatusCode.SUCCESS).json({message: "Vehicle deleted and updated successfully in the shop",});
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
}
