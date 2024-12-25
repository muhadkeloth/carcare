import { NextFunction, Request, Response } from "express";
import Shop from "../models/Shop";
import { randomPassword } from "../utils/functions";
import { sendOtpEmail } from "../utils/emailService";
import { AppError } from "../middleware/errorHandler";
import { HttpStatusCode, IUser } from "../utils/interface";
import BaseController from "./BaseController";
import AdminService from "../services/AdminService";
import ShopService from "../services/ShopService";
import ShopRepository from "../repositories/ShopRepository";
import logger from "../middleware/logger";
import VehicleService from "../services/VehicleService";
import VehicleRepository from "../repositories/VehicleRepository";
import Vehicle from "../models/Vehicle";
import BookingService from "../services/BookingService";
import PickupService from "../services/PickupService";
import BookingRepository from "../repositories/BookingRepository";
import PickupRepository from "../repositories/PickupRepository";
import Bookings from "../models/Bookings";
import Pickups from "../models/Pickups";

export default class AdminController extends BaseController<IUser> {
  protected shopService: ShopService;
  protected vehicleService: VehicleService;
  protected bookingService: BookingService;
  protected pickupService: PickupService;

  constructor(protected service: AdminService) {
    super(service);
    const shopRepository = new ShopRepository(Shop);
    this.shopService = new ShopService(shopRepository);
    const vehicleRepository = new VehicleRepository(Vehicle)
    this.vehicleService = new VehicleService(vehicleRepository);
    const bookingRepository = new BookingRepository(Bookings)
    this.bookingService = new BookingService(bookingRepository);
    const pickupRepository = new PickupRepository(Pickups)
    this.pickupService = new PickupService(pickupRepository);
  }

    userDetails = async (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
        const users = await this.service.findUsers(skip, limit);
        const totalUsers = (await this.service.findCountUsers()) ?? 0;
      logger.info('User found');
      res.status(HttpStatusCode.SUCCESS).json({
          users,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page,
        });
    } catch (error) {
        const err = error as Error;
        logger.error(`user detail error ${err.message}`);
        next(err);
    }
  };

  toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      if (!id) {
        logger.warn(`id required`)
        throw new AppError("ID is required", HttpStatusCode.NOT_FOUND);
      }
      const user = await this.service.toggleStatus(id);
      logger.info(`status successfully changed`)
      res.status(HttpStatusCode.CREATED).json(user);
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  };

  addShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shopName, ownerName, email, phoneNumber, address, location } = req.body;
      const parseAddress = JSON.parse(address);
      const parsedLocation = JSON.parse(location);
      const otp = randomPassword(8);
      
      let existingUser = await this.shopService.findOne({ email });
      if (existingUser){
        logger.warn('email address already exists')
        throw new AppError("email address already exists",HttpStatusCode.BAD_REQUEST);
      }
      if (phoneNumber) {
        existingUser = await this.shopService.findOne({ phoneNumber });
        if (existingUser){
            logger.warn('phoneNumber already exists')
            throw new AppError("phoneNumber already exists",HttpStatusCode.BAD_REQUEST);
        }
      }
      await sendOtpEmail(email, otp);

      const newShop = new Shop({//make a obj and pass it
        shopName, ownerName,
        email, phoneNumber,
        address: parseAddress, otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
        location: {
          type: "Point",
          coordinates: parsedLocation,
        },
        image: req.file ? req.file.path : null,
      });
      console.log("admin shop add");

      const updatedShop = await newShop.save(); // create shop
      logger.info("shop created successfully");
      res.status(HttpStatusCode.CREATED)
         .json({ message: "shop added successfully", shop: updatedShop });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error create shop: ${err.message}`);
      next(err);
    }
  };

  shopdetails = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
      const workShop = await this.shopService.findShops(skip, limit);
      const totalWorkShop = (await this.shopService.findCountShops()) ?? 0;
      logger.info('fetch shop details');
      res.status(HttpStatusCode.SUCCESS).json({workShop, totalPages: Math.ceil(totalWorkShop / limit),currentPage: page,});
    } catch (error) {
        const err = error as Error;
        logger.error(`Error shop details: ${err.message}`)
        next(err);
    }
  };

  toggleShopStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
      const shop = await this.shopService.toggleStatus(id);
      res.status(HttpStatusCode.CREATED).json(shop);
    } catch (error) {
        const err = error as Error;
        logger.error(`Error status change ${err.message}`);
        next(err);
    }
  };


  
  getvehicleDetails = async (req: Request, res: Response, next: NextFunction) => {
   
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      const Vehicle = await this.vehicleService.findVehicles(skip, limit);
      const totaVehicles = (await this.vehicleService.findCountVehicles()) ?? 0;

      res.status(HttpStatusCode.SUCCESS).json({ Vehicle, totalPages: Math.ceil(totaVehicles/limit), currentPage: page });
    } catch (error) {
        const err = error as Error;
        logger.error(`error fetching vehicle details in shop: ${err.message}`);
        next(err);
    }
  };

  addVehicleDetails = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const { brand, vehicleModel } = req.body;

      await this.vehicleService.createVehicle(brand, vehicleModel); 

      res.status(HttpStatusCode.CREATED).json({ message: "Vehicle added successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error adding vehicle details: ${err.message}`);
        next(err);
    }
  };

  editVehicleDetails = async (req: Request,res: Response,next: NextFunction) => {
    try {
      const { brand, vehicleModel } = req.body;

      const vehicleupload = await this.vehicleService.editVehicle(brand, vehicleModel); 
      if (!vehicleupload){
        logger.warn("vehicle not found");
        throw new AppError("vehicle not found", HttpStatusCode.NOT_FOUND);
      }

      res.status(HttpStatusCode.CREATED).json({ vehicle:vehicleupload, message: "update vehicle details successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating vehicle details: ${err.message}`);
        next(err);
    }
  };

  deleteVehicleDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brand = req.params.brand;
      if (!brand){
        logger.warn("vehicle brand is required for deletion ");
        throw new AppError("vehicle brand is required for deletion ",HttpStatusCode.BAD_REQUEST);
      }

      await this.vehicleService.deleteByBrand(brand);

      res.status(HttpStatusCode.SUCCESS).json({message: "Vehicle deleted and updated successfully"});
    } catch (error) {
        const err = error as Error;
        logger.error(`Error delete vehicle details: ${err.message}`);
        next(err);
    }
  };

  // 
  dashStatistics = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const [
        bookingsCountforChart,
        pickupsCountforChart,
        bookingsPriceCountforChart,
        pickupsPriceCountforChart,
        bookingsRatingCountforChart,
        pickupsRatingCountforChart,
        UpComingbookings,
        UpComingpickups,
        totalbookingsbyStatus,
        totalpickupsbyStatus,
        totalbookingRevenue,
        totalpickupRevenue
      ] = await Promise.all([
        this.bookingService.getCompletedBookings(),
        this.pickupService.getCompletedPickups(),
        this.bookingService.getPricesBooking(),
        this.pickupService.getPricesPickups(),
        this.bookingService.getRatingBooking(),
        this.pickupService.getRatingPickups(),
        this.bookingService.getUpComingBooking(),
        this.pickupService.getUpComingPickups(),
        this.bookingService.getTotalBookingByStatus(),
        this.pickupService.getTotalPickupsByStatus(),
        this.bookingService.getTotalBookingRevenue(),
        this.pickupService.getTotalPickupRevenue(),
      ])

      res.status(HttpStatusCode.SUCCESS).json({message:"successsfully fetch dash statistics",
        bookingsCountforChart,
        pickupsCountforChart,
        bookingsPriceCountforChart,
        pickupsPriceCountforChart,
        bookingsRatingCountforChart,
        pickupsRatingCountforChart,
        UpComingbookings,
        UpComingpickups,
        totalbookingsbyStatus,
        totalpickupsbyStatus,
        totalbookingRevenue,
        totalpickupRevenue
      })
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  }

  barChartFilter = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const period = ['monthly','yearly','weekly'].includes(req.query.period as string) ? (req.query.period as 'monthly' | 'yearly' | 'weekly') : 'monthly';
      const [
        bookingsCountforChart,
        pickupsCountforChart,
      ] = await Promise.all([
        this.bookingService.getCompletedBookings(),
        this.pickupService.getCompletedPickups(),
      ])
      res.status(HttpStatusCode.SUCCESS).json({message:"successsfully filtered bar chart",
        bookingsCountforChart,
        pickupsCountforChart,
      })      
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  }
 
  lineChartFilter = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const period = ['monthly','yearly','weekly'].includes(req.query.period as string) ? (req.query.period as 'monthly' | 'yearly' | 'weekly') : 'monthly';
      const [
        bookingsPriceCountforChart,
        pickupsPriceCountforChart,
      ] = await Promise.all([
        this.bookingService.getPricesBooking(),
        this.pickupService.getPricesPickups(),
      ])
      res.status(HttpStatusCode.SUCCESS).json({message:"successsfully filtered line chart",
        bookingsPriceCountforChart,
        pickupsPriceCountforChart,
      })      
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  }

  brokeragedetails = async(req:Request,res:Response,next:NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const {action} = req.params;
    try {
      if(!action){
        logger.warn(`error to action required`);
        throw new AppError("error to action required", HttpStatusCode.BAD_REQUEST);
      }
      const bookingservice = action === 'booking' ? this.bookingService : this.pickupService;
      const brokerageData = await bookingservice.findBrokerage(skip,limit)
      const totalBrokerage = (await bookingservice.findBrockerageCount()) ?? 0;
      res.status(HttpStatusCode.SUCCESS).json({
        brokerageData,
          totalPages: Math.ceil(totalBrokerage / limit),
          currentPage: page,
        });
      
    } catch (error) {
      const err = error as Error;
      logger.error(`Error fetch brockerage details: ${err.message}`);
      next(err);
    }
  }







}
