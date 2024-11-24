import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../utils/interface";
import BaseService from "../services/BaseService";
import { Document } from "mongoose";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/errorHandler";
import {otpgenerateFn, otpvalidationFn, resetPasswordFn,} from "./commonController";
import logger from "../middleware/logger";

interface Doc extends Document {
  isActive?: boolean;
  password?: string;
}

export default abstract class BaseController<T extends Doc> {
  constructor(protected service: BaseService<T>) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;

    try {
      const data = role === "shop" ? { email } : { email, role };
      const user = await this.service.findOne(data);
      if (!user){
        logger.warn('user not found')
        throw new AppError("email not found", HttpStatusCode.BAD_REQUEST);
      }
      if (!user?.isActive){
        logger.warn('user blocked')
        throw new AppError("Account is blocked. Please contact customer care.",HttpStatusCode.FORBIDDEN);
      }

      await this.service.validatePassword(password,user?.password ?? "","password");

      const JWT_SALT = process.env.JWT_SALT || "sem_nem_kim_12@32";
      const token = jwt.sign({ id: user._id, role }, JWT_SALT, {expiresIn: "1D",});

      res.status(HttpStatusCode.SUCCESS).json({ token, role, message: "Login successful" });
    } catch (error) {
      const err = error as Error;
      logger.error(`error login ${err.message}`)
      next(err);
    }
  };

  otpgenerate = async (req: Request, res: Response, next: NextFunction) => {
    const { email, role } = req.body;
    try {
      const response = await otpgenerateFn(email, role);
      res.status(response.status).json({ message: response.message });
    } catch (error) {
        const err = error as Error;
        logger.error(`otp generate error: ${err.message}`)
        next(err);
    }
  };

  otpvalidation = async (req: Request, res: Response, next: NextFunction) => {
    const { otp, email, role } = req.body;
    try {
      const response = await otpvalidationFn(email, otp, role);
      res.status(response.status).json({ message: response.message });
    } catch (error) {
        const err = error as Error;
        logger.error(`otp error: ${err.message}`);
        next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;
    try {
      const response = await resetPasswordFn(email, password, role);
      res.status(response.status).json({ message: response.message });
    } catch (error) {
        const err = error as Error;
        logger.error(`reset password error: ${err.message}`);
        next(err);
    }
  };
}
