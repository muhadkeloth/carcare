import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../utils/interface";
import logger from "./logger";

interface ErrorWithStatus extends Error {
    statusCode?: number;
    status?: string;
}

export class AppError extends Error {
    statusCode:number;
    status:string;
    isOperational:boolean;

    constructor(message:string,statusCode:number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ?'fail':'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err:ErrorWithStatus, req:Request, res:Response, next:NextFunction) => {
    err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';
    logger.error(`[${err.statusCode}] ${err.message}`);

    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        // cut stack line when production
        stack:err.stack
    })
}