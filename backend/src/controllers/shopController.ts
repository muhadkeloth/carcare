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
import BookingService from "../services/BookingService";
import PickupService from "../services/PickupService";
import Bookings from "../models/Bookings";
import Pickups from "../models/Pickups";
import Chat from "../models/Chat";
import Message from "../models/Message";
import PickupRepository from "../repositories/PickupRepository";
import BookingRepository from "../repositories/BookingRepository";
import ChatService from "../services/ChatService";
import MessageService from "../services/MessageService";
import ChatRepository from "../repositories/ChatRepository";
import MessageRepository from "../repositories/MessageRepository";

export class ShopController extends BaseController<any> {
  protected vehicleService: VehicleService;
  protected bookingService: BookingService;
  protected pickupService: PickupService;
  protected chatService: ChatService;
  protected messageService: MessageService;

  constructor(protected service: ShopService) {
    super(service);
    const vehicleRepository = new VehicleRepository(Vehicle)
    this.vehicleService = new VehicleService(vehicleRepository);
    const bookingRepository = new BookingRepository(Bookings)
    this.bookingService = new BookingService(bookingRepository);
    const pickupRepository = new PickupRepository(Pickups)
    this.pickupService = new PickupService(pickupRepository);
    const chatRepository = new ChatRepository(Chat)
    this.chatService = new ChatService(chatRepository);
    const messageRepository = new MessageRepository(Message)
    this.messageService = new MessageService(messageRepository);
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
      if (!req.user){
        logger.warn('update shop details shop id not found')
        throw new AppError("update shop details shop id not found",HttpStatusCode.BAD_REQUEST);
      }
      if (!req.file){
        logger.warn('file required')
        throw new AppError("upload shop image file not found",HttpStatusCode.BAD_REQUEST);
      }
      const userdetails = await this.service.findOne({_id:req.user});
      if (!userdetails){
        logger.warn('userdetails not found')
        throw new AppError("userdetails shop detail not found",HttpStatusCode.BAD_REQUEST);
      }
      userdetails.image = req.file.path
      const updateduser = await this.service.updateById(req.user as string,userdetails)
      
      res.status(HttpStatusCode.CREATED).json({ imagePath:updateduser.image, message: "image uploaded successfully" });
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
      const { shopName, ownerName, phoneNumber, location, address, image } =req.body;
      const updatedShop = await this.service.updateById(req.user as string, {
        shopName,ownerName,
        phoneNumber,address,
        location,image,
      });

      res.status(HttpStatusCode.CREATED).json({ success: true, shop: updatedShop });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating shop profile details: ${err.message}`);
        next(err);
    }
  };
  
  updateShopProfileInfo = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('update shop details shop id not found')
        throw new AppError("update shop details shop id not found",HttpStatusCode.BAD_REQUEST);
      }      
      const { about, title, discript } =req.body;

      const updatedShop = await this.service.updateById(req.user as string, {
        about,
        discription:{title,discript}
      });

      res.status(HttpStatusCode.CREATED).json({ success: true, shop: updatedShop });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating shop profile details: ${err.message}`);
        next(err);
    }
  };

  updateShopProfileWorkTime = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('update shop details shop id not found')
        throw new AppError("update shop details shop id not found",HttpStatusCode.BAD_REQUEST);
      }      
      const { opening, closing} =req.body;      
      const updatedShop = await this.service.updateById(req.user as string, {
        workingTime:{ opening, closing },
      });

      res.status(HttpStatusCode.CREATED).json({ success: true, shop: updatedShop });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating shop worktime details: ${err.message}`);
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

  getShopPickups = async (req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const pickupsData = await this.pickupService.findPickupsByShopId(req.user as string,skip,limit)
      const totalPickups = (await this.pickupService.findPickupsCountByShopId(req.user as string)) ?? 0;
      res.status(HttpStatusCode.SUCCESS).json({
        pickupsData,
          totalPages: Math.ceil(totalPickups / limit),
          currentPage: page,
        });
      
    } catch (error) {
      const err = error as Error;
      logger.error(`Error fetch pickup  details: ${err.message}`);
      next(err);
    }
  }

  togglePickupStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status,reason } = req.body;
    try {
      if (!id) {
        logger.warn(`id required`)
        throw new AppError("ID is required", HttpStatusCode.NOT_FOUND);
      }
      const updatedPickpDetails = await this.pickupService.togglePickupStatus(id,status,reason,'shop');
      if(!updatedPickpDetails) {
        logger.warn(`status update error`)
        throw new AppError("status update error", HttpStatusCode.NOT_FOUND);
      }
      logger.info(`status successfully changed`)
      res.status(HttpStatusCode.CREATED).json({updatedPickpDetails,message:'status updated successfuly'});
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  };

  getShopBookings = async (req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const bookingData = await this.bookingService.findBookingsByShopId(req.user as string,skip,limit)
      const totalBookings = (await this.bookingService.findBookingsCountByShopId(req.user as string)) ?? 0;
      res.status(HttpStatusCode.SUCCESS).json({
        bookingData,
          totalPages: Math.ceil(totalBookings / limit),
          currentPage: page,
        });
      
    } catch (error) {
      const err = error as Error;
      logger.error(`Error fetch booking details: ${err.message}`);
      next(err);
    }
  }

  toggleBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status,reason } = req.body;
    try {
      if (!id) {
        logger.warn(`id required`)
        throw new AppError("ID is required", HttpStatusCode.NOT_FOUND);
      }
      const updatedBookingDetails = await this.bookingService.toggleBookingStatus(id,status,reason,'shop');
      if(!updatedBookingDetails) {
        logger.warn(`status update error`)
        throw new AppError("status update error", HttpStatusCode.NOT_FOUND);
      }
      logger.info(`status successfully changed`)
      res.status(HttpStatusCode.CREATED).json({updatedBookingDetails,message:'status updated successfuly'});
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  };

  dashStatistics = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const shopId = req.user as string;
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
        this.bookingService.getCompletedBookings(shopId),
        this.pickupService.getCompletedPickups(shopId),
        this.bookingService.getPricesBooking(shopId),
        this.pickupService.getPricesPickups(shopId),
        this.bookingService.getRatingBooking(shopId),
        this.pickupService.getRatingPickups(shopId),
        this.bookingService.getUpComingBooking(shopId),
        this.pickupService.getUpComingPickups(shopId),
        this.bookingService.getTotalBookingByStatus(shopId),
        this.pickupService.getTotalPickupsByStatus(shopId),
        this.bookingService.getTotalBookingRevenue(shopId),
        this.pickupService.getTotalPickupRevenue(shopId),
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

  barChartFilter = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const shopId = req.user as string;
      const period = ['monthly','yearly','weekly'].includes(req.query.period as string) ? (req.query.period as 'monthly' | 'yearly' | 'weekly') : 'monthly';
      const [
        bookingsCountforChart,
        pickupsCountforChart,
      ] = await Promise.all([
        this.bookingService.getCompletedBookings(shopId,period),
        this.pickupService.getCompletedPickups(shopId,period),
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
 
  lineChartFilter = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const shopId = req.user as string;
      const period = ['monthly','yearly','weekly'].includes(req.query.period as string) ? (req.query.period as 'monthly' | 'yearly' | 'weekly') : 'monthly';
      const [
        bookingsPriceCountforChart,
        pickupsPriceCountforChart,
      ] = await Promise.all([
        this.bookingService.getPricesBooking(shopId,period),
        this.pickupService.getPricesPickups(shopId,period),
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

  newChatRoomByUser = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const {userId} = req.params;
      // const userId = req.query.userId;
      if(!userId){
        logger.warn(`error to create chat room`);
        throw new AppError("error to create chat room", HttpStatusCode.BAD_REQUEST);
      }
      const chatRooms = await this.chatService.createNewRoom(userId,req.user as string)
      // const chatRooms = await this.chatService.createNewRoom(userId as string,shopId)
      if(!chatRooms){
        logger.warn(`error to create chat room`);
        throw new AppError("error to create chat room", HttpStatusCode.BAD_REQUEST);
      }
      res.status(HttpStatusCode.CREATED).json({chatRooms,message:'created chat rooms'})
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  }

  fetchChatHistory = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const chatRooms = await this.chatService.findAllChatsbyId({shopId:req.user as string})
      
      res.status(HttpStatusCode.SUCCESS).json({chatRooms,message:'fetch successfully all chat rooms'})
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  }

  fetchMessagesbyChatId = async(req:Request,res:Response,next:NextFunction) => {
    try {      
      const { chatId } = req.params;
      const allMessages = await this.messageService.fetchAllMessagesByChatId(chatId)
      
      res.status(HttpStatusCode.SUCCESS).json({allMessages,message:'fetch successfully all messages'})
    } catch (error) {
      const err = error as Error;
      logger.error(`fetch message error ${err.message}`);
      next(err);
    }
  }

  saveImageMessage = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      if (!req.file){
        logger.warn('file required')
        throw new AppError("upload user image file not found",HttpStatusCode.BAD_REQUEST);
      }
      res.status(HttpStatusCode.SUCCESS).json({image:req.file.path,message:'save message image successfully '})
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  }

  saveMessage = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const { chatId, message,imagePath } = req.body;
      const savedMessage = await this.messageService.saveMessageByChatId(chatId,req.user as string,message,imagePath)      
      res.status(HttpStatusCode.SUCCESS).json({savedMessage,message:'save message successfully '})
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  }








}
