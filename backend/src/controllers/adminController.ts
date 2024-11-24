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

export default class AdminController extends BaseController<IUser> {
  protected shopService: ShopService;

  constructor(protected service: AdminService) {
    super(service);
    const shopRepository = new ShopRepository(Shop);
    this.shopService = new ShopService(shopRepository);
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
      await sendOtpEmail(email, otp);

      const newShop = new Shop({
        shopName, ownerName,
        email, phoneNumber,
        address: parseAddress, otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
        location: {
          type: "Point",
          coordinates: [parsedLocation.longitude, parsedLocation.latitude],
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








}
