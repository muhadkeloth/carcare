import { NextFunction, Request, Response } from "express";
import { IUser } from "../utils/interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Shop from "../models/Shop";
import { otpgeneraterForSignup } from "./commonController";
import { AppError } from "../middleware/errorHandler";
import { AuthenticatedRequest, HttpStatusCode } from "../utils/interface";
import UserService from "../services/UserService";
import ShopService from "../services/ShopService";
import BaseController from "./BaseController";
import ShopRepository from "../repositories/ShopRepository";
import logger from "../middleware/logger";
import VehicleService from "../services/VehicleService";
import VehicleRepository from "../repositories/VehicleRepository";
import Vehicle from "../models/Vehicle";

export default class UserController extends BaseController<IUser> {
  protected shopService: ShopService;
  protected vehicleService: VehicleService;

  constructor(protected service: UserService) {
    super(service);
    const shopRepository = new ShopRepository(Shop);
    this.shopService = new ShopService(shopRepository);
    const vehicleRepository = new VehicleRepository(Vehicle)
    this.vehicleService = new VehicleService(vehicleRepository);

  }

  signupOtpGenerate = async (req: Request,res: Response,next: NextFunction) => {
    const { phoneNumber, email } = req.body;
    try {
      let existingUser = await this.service.findOne({ email });
      if (existingUser){
        logger.warn('email address already exists')
        throw new AppError("email address already exists",HttpStatusCode.BAD_REQUEST);
      }
      if (phoneNumber) {
        existingUser = await this.service.findOne({ phoneNumber });
        if (existingUser){
            logger.warn('phoneNumber already exists')
            throw new AppError("phoneNumber already exists",HttpStatusCode.BAD_REQUEST);
        }
      }

      const response = await otpgeneraterForSignup(email);
      res.status(response.status).json({ message: response.message, otp: response.hashedOtp });
    } catch (error) {
        const err = error as Error;
        logger.error(`error in signup otp generate: ${err.message}`);
        next(err);
    }
  };

  signup = async (req: Request, res: Response, next: NextFunction) => {
    const { username, phoneNumber, email, password, otp, userOtp } = req.body;
    try {
      let existingUser = await this.service.findOne({ email });
      if (existingUser){
        logger.warn('email address already exists')
        throw new AppError("email address already exists",HttpStatusCode.BAD_REQUEST);
      }
      existingUser = await this.service.findOne({ phoneNumber });
      if (existingUser){
        logger.warn('phoneNumber already exists')
        throw new AppError("phoneNumber already exists",HttpStatusCode.BAD_REQUEST);
      }

      await this.service.validatePassword(userOtp, otp, "otp");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.service.create({
        username,phoneNumber,
        email,password: hashedPassword,
      } as IUser);

      const JWT_SALT = process.env.JWT_SALT || "sem_nem_kim_12@32";
      const token = jwt.sign({ id: user._id, role: "user" }, JWT_SALT, {expiresIn: "1D",});

      res.status(HttpStatusCode.CREATED).json({ token, role: "user", message: "User registered successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`error in signup: ${err.message}`);
        next(err);
    }
  };

  getNearShops = async (req: Request, res: Response, next: NextFunction) => {
    const { latitude, longitude } = req.query;
    const radiusInKm = 20;
    const limit = 3;

    if (!latitude || !longitude) {
        logger.warn('Latitude and longitude are required.')
        throw new AppError("Latitude and longitude are required.",HttpStatusCode.BAD_REQUEST);
    }
    try {
      const shops = await this.shopService.findNearbyShops(
        parseFloat(latitude as string), parseFloat(longitude as string),
        radiusInKm, limit
      );

      res.status(HttpStatusCode.SUCCESS).json({ shops, message: "successfully fetch shops " });
    } catch (error) {
        const err = error as Error;
        logger.error(`error fetching nearby shops: ${err.message}`);
        next(err);
    }
  };

  userDetails = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    if (!req.user){
        logger.warn('error to find userdetails')
        throw new AppError("error to find userdetails",HttpStatusCode.BAD_REQUEST);
    }

    try {
      const _id = req.user as string;
      const userdetails = await this.service.findOne({ _id });

      if (!userdetails){
        logger.warn('finding user details failed')
        throw new AppError("finding user details failed ",HttpStatusCode.NOT_FOUND);
      }

      const userdet = {
        _id: userdetails?._id,
        username: userdetails?.username,
        phoneNumber: userdetails?.phoneNumber,
        email: userdetails?.email,
        // image:userdetails?.image,
        isActive: userdetails?.isActive,
        role: userdetails?.role,
      };

      res.status(HttpStatusCode.SUCCESS).json({ userdet, message: "User details fetched successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`error fetching nearby userdetails: ${err.message}`);
        next(err);
    }
  };

  shopDetails = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('User not found or authenticated')
        throw new AppError("Error: User not found or authenticated",HttpStatusCode.NOT_FOUND);
      }
      const id = req.params.id;
      const shopUser = await this.shopService.findShopDetailsById(id);
      if (!shopUser){
        logger.warn('shop user not found in backend')
        throw new AppError("shop user not found in backend",HttpStatusCode.NOT_FOUND);
      }

      res.status(HttpStatusCode.SUCCESS).json({ shopUser, message: "shop User find successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error finding shopuser details: ${err.message}`);
        next(err);
    }
  };


  getShopByPincode = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const pincode = req.params.pincode;
      if(!pincode){
        logger.warn('shop pincode not found in backend')
        throw new AppError("shop pincode not found in backend",HttpStatusCode.NOT_FOUND);
      }
      
      const suggestions = await this.shopService.findShopPincodeByFilter(pincode);
      
      res.status(HttpStatusCode.SUCCESS).json({ suggestions, message: "shop pincode find successfully" });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error finding shop by pincode: ${err.message}`);
      next(err);
    }
  }

  getShopsFilterByPincode = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const {pincode} = req.params;
      const shops = await this.shopService.findFilterShopByPincode(pincode);
      if(!shops || shops.length == 0){
        throw new AppError("shop filter by pincode not found in backend",HttpStatusCode.NOT_FOUND);
      };

      res.status(HttpStatusCode.SUCCESS).json({ shops , message: "shop filtered by pincode find successfully" });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error finding shop by pincode: ${err.message}`);
      next(err);
    }
  }

  getModelByMakeVehicle = async(req:Request, res:Response,next:NextFunction) => {
    try {
      const { _id, make } = req.query;
      
      const shop = await this.shopService.findOne({ _id });
      if(!shop) throw new AppError("shop details not found ",HttpStatusCode.NOT_FOUND);
      const vehicledetails = shop?.vehicleIds?.find(v=> v.brand == make);
      
      if(!vehicledetails) throw new AppError("shop vehicle details not found ",HttpStatusCode.NOT_FOUND);

      const modeldetails = await Promise.all(
        vehicledetails.vehicleModelIds.map(async (modelId) => {
          const modelDetails = await this.vehicleService.findOne({ _id:modelId });
          if(!modelDetails)return null;
          return modelDetails.vehicleModel;
        })
      );
      
      res.status(HttpStatusCode.SUCCESS).json({ models:modeldetails , message: "shop filtered by pincode find successfully" });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error finding model in vehicle collection: ${err.message}`);
      next(err);
    }
  }







}
