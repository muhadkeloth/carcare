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
import { handlePayment } from "./paymentController";
import BookingService from "../services/BookingService";
import BookingRepository from "../repositories/BookingRepository";
import PickupRepository from "../repositories/PickupRepository";
import Bookings from "../models/Bookings";
import Pickups from "../models/Pickups";
import PickupService from "../services/PickupService";
import { sendCancelEmail, sendPickupConfirmEmail } from "../utils/emailService";




export default class UserController extends BaseController<IUser> {
  protected shopService: ShopService;
  protected vehicleService: VehicleService;
  protected bookingService: BookingService;
  protected pickupService: PickupService;

  constructor(protected service: UserService) {
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
    const limit = 10;

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
        image:userdetails?.image,
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

  uploadUserProfileImg = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('update details user id not found')
        throw new AppError("update details user id not found",HttpStatusCode.BAD_REQUEST);
      }
      if (!req.file){
        logger.warn('file required')
        throw new AppError("upload user image file not found",HttpStatusCode.BAD_REQUEST);
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
        logger.error(`Error upload user profile image: ${err.message}`);
        next(err);
    }
  };

  updateUserProfileDetails = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('update details user id not found')
        throw new AppError("update details user id not found",HttpStatusCode.BAD_REQUEST);
      }
      const { username, phoneNumber } =req.body;
      const existingUser = await this.service.findOne({ $and:[{phoneNumber:phoneNumber},{_id:{$ne:req.user}}] });
      if (existingUser){
        logger.warn('phoneNumber already exists')
        throw new AppError("phoneNumber already exists",HttpStatusCode.BAD_REQUEST);
      }
      const updatedUser = await this.service.updateById(req.user as string, {username,phoneNumber});

      res.status(HttpStatusCode.CREATED).json({ success: true, updatedUser });
    } catch (error) {
        const err = error as Error;
        logger.error(`Error updating user profile details: ${err.message}`);
        next(err);
    }
  };

  updateUserProfilepassword = async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
    try {
      if (!req.user){
        logger.warn('password change error, user id not found')
        throw new AppError("password change error, user id not found",HttpStatusCode.BAD_REQUEST);
      }
      const { currentPassword, newPassword } = req.body;

      const userdetails = await this.service.findOne({_id: req.user as string,});
      if (!userdetails){
        logger.warn('user details not found ')
        throw new AppError("user details not found ", HttpStatusCode.NOT_FOUND);
      }
      if (userdetails?.password) {
        await this.service.validatePassword(currentPassword,userdetails.password,"password");

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        userdetails.password = hashedNewPassword;
        await userdetails.save(); 

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

  // bookingConfirm = async (req:AuthenticatedRequest,res:Response,next:NextFunction) => {
  //   const { token, bookingDetails, description } = req.body;
  //   try {
  //     if (!req.user){
  //       logger.warn('password change error, user id not found')
  //       throw new AppError("password change error, user id not found",HttpStatusCode.BAD_REQUEST);
  //     }
  //     if (!['booking', 'pickup'].includes(description)) {
  //       throw new AppError("Invalid description value", HttpStatusCode.BAD_REQUEST);
  //     }      
  //     const bookingdetail = {
  //       ...bookingDetails,
  //       userId:req.user,
  //       paymentStatus:'PENDING',
  //     }
  //     const paymentResult  = await handlePayment(token,bookingDetails.amount,`${description} payment`);
  //     const bookingservice = description == 'booking' ? this.bookingService : this.pickupService;
  //     if(paymentResult.success){
  //       bookingdetail.paymentStatus = 'PAID';
  //       await bookingservice.create(bookingdetail);
  //       res.status(HttpStatusCode.SUCCESS).json({success:true,message:`${description} confirmed and payment successful.`})
  //     }else{
  //       await this.service.create(bookingdetail);
  //         res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:`${description} failed. Booking status set to pending.`})
  //     }
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(`Error in ${description} confirmation: ${err.message}`);
  //     next(err);
  //   }
  // }

  // 
  bookingConfirm = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { token, bookingDetails, description } = req.body;
    try {
      if (!req.user) {
        logger.warn('Booking confirmation error: User ID not found');
        throw new AppError("Booking confirmation error: User ID not found", HttpStatusCode.BAD_REQUEST);
      }  
      if (!['booking', 'pickup'].includes(description)) {
        throw new AppError("Invalid description value", HttpStatusCode.BAD_REQUEST);
      }  
      let bookingdetail = {
        ...bookingDetails,
        userId: req.user,
        paymentStatus: 'PENDING',
      };   
      const paymentResult = await handlePayment(token, bookingDetails.amount, `${description} payment`);
      const bookingservice = description === 'booking' ? this.bookingService : this.pickupService;
      if (paymentResult.success) {
        bookingdetail.paymentStatus = 'PAID';
        if(bookingdetail._id){
          await bookingservice.updatePaymentStatus(bookingdetail._id, bookingdetail); 
        }else{
          await bookingservice.create(bookingdetail);
        }
         res.status(HttpStatusCode.SUCCESS).json({ success: true, message: `${description} confirmed and payment successful.` });
      } else {
        if (!bookingDetails._id) {
          await bookingservice.create(bookingdetail);
        }
         res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: `${description} failed. Booking status set to pending.` });
      }
    } catch (error) {
      const err = error as Error;
      logger.error(`Error in ${description} confirmation: ${err.message}`);
      next(err);
    }
  };
  // 

  getUserBookings = async (req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const bookingData = await this.bookingService.findBookingsByUserId(req.user as string,skip,limit)
      const totalBookings = (await this.bookingService.findBookingsCountByUserId(req.user as string)) ?? 0;
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
      const updatedBookingDetails = await this.bookingService.toggleBookingStatus(id,status,reason,'user');
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

  getUserPickups = async (req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      if (!req.user){
        logger.warn(`error to find shop id`);
        throw new AppError("error to find shopid", HttpStatusCode.BAD_REQUEST);
      }
      const pickupsData = await this.pickupService.findPickupsByUserId(req.user as string,skip,limit)
      const totalPickups = (await this.pickupService.findPickupsCountByUserId(req.user as string)) ?? 0;
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
      const updatedPickpDetails = await this.pickupService.togglePickupStatus(id,status,reason,'user');
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

  updateFeedback = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { rating,feedback, bookingModel } = req.body;
    try {
      if (!id) {
        logger.warn(`id required`)
        throw new AppError("ID is required", HttpStatusCode.NOT_FOUND);
      }
      const bookingservice = bookingModel === 'booking' ? this.bookingService : this.pickupService;
      const updatedPickpDetails = await bookingservice.updatefeedbackbyUser(id,rating,feedback);
      if(!updatedPickpDetails) {
        logger.warn(`feedback update error`)
        throw new AppError("feedback update error", HttpStatusCode.NOT_FOUND);
      }
      logger.info(`feedback successfully updated`)
      const updatedRating = await this.shopService.updateRating(updatedPickpDetails.shopId,rating)
      if(!updatedRating) {
        logger.warn(`rating  update to shop error`)
        throw new AppError("rating  update to shop error", HttpStatusCode.NOT_FOUND);
      }
      res.status(HttpStatusCode.CREATED).json({updatedPickpDetails,message:'feedback updated successfuly'});
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  };

  fetchShopReviews = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        logger.warn(`id required`)
        throw new AppError("ID is required", HttpStatusCode.NOT_FOUND);
      }
      const allReviewsByBookings = await this.bookingService.getReviewsByShopId(id)
      const allReviewsByPickups = await this.pickupService.getReviewsByShopId(id)
      const allReviews = [...allReviewsByBookings,...allReviewsByPickups];
      console.log('allReviewsByBookings',allReviewsByBookings)
      res.status(HttpStatusCode.SUCCESS).json({allReviews,message:'reviews fetch successfuly'});
    } catch (error) {
      const err = error as Error;
      logger.error(`status update error ${err.message}`);
      next(err);
    }
  }

  // 
  // gpt = async(req:Request,res:Response,next:NextFunction) => {
      // const {brand,model,year,task} = req.query;
      // try {
        // await sendCancelEmail({
        //   email:'jemuqoha@logsmarter.net',
        //   username:'hello thing',
        //   time:'9:30 AM',
        //   date:'2024-12-17T18:30:00.000Z',
        // },'Booking')
        // await sendCancelEmail({
        //   email:'jemuqoha@logsmarter.net',
        //   username:'hello pick thing',
        //   time:'10:30 AM',
        //   date:'2024-12-17T18:30:00.000Z',
        // },'Pickup')
        // await sendPickupConfirmEmail({
        //   email:'jemuqoha@logsmarter.net',
        //   username:'things  ',
        //   address:'Payyanur, Kerala, 670307, India',
        //   time:'11:30 AM',
        //   date:'2024-12-17T18:30:00.000Z'
        // })
        // const prompt = `Provide an average cost estimate for ${task} for a ${brand} ${model} (${year}) in India.`;
        // const prompt1 = `
        // Based on the following data, provide an average cost for ${task} for a ${brand} ${model} (${year}) in india.`
        // console.log('prompt',prompt)
        // const response = await openai.chat.completions.create({
          // model: 'gpt-3.5-turbo',
          // model: 'text-davinci-003',
          // model: 'gpt-3.5-turbo',
          // messages:[{role: "user",content: "Hello!"}],
          // messages:[{role: "system",content: "You are a helpful assistant."},{role: "user",content: "Hello!"}],
          // messages: [{role:'system',content:'you are a car repair cost estimator'},{ role:'user', content: prompt }],
          // max_tokens:400,
        // })
        // const estimate = response.choices[0]?.text.trim();
        // console.log('response',response)
        // res.json({estimate})
  //     } catch (error) {
  //       const err = error as Error;
  //       console.error('some',err)
  //       next(err)
  //     }
  // }

 




}
