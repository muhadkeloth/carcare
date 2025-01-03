import jwt from 'jsonwebtoken'
import { AppError } from '../middleware/errorHandler';
import { HttpStatusCode } from './interface';


export const randomPassword = (length:number):string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%&*|<>?';

    const passwordArray = [
        uppercase.charAt(Math.floor(Math.random() * uppercase.length)),
    ];
    
    for (let i = 1; i < length-2; i++) {
        passwordArray.push(lowercase.charAt(Math.floor(Math.random() * lowercase.length)))
    }
    passwordArray.push(
        specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length)),
        numbers.charAt(Math.floor(Math.random() * numbers.length)), 
    )
    
    return passwordArray.join('');
}

export const generateTokens = ({ id, role }:{id:any,role:string}) => {
    const JWT_SALT = process.env.JWT_SALT || "sem_nem_kim_12@32";
    const accessToken = jwt.sign({ id, role }, JWT_SALT, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id, role }, JWT_SALT, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  };

  export const generateAccessTokens = (refreshToken: string): string => {
    const JWT_SALT = process.env.JWT_SALT || "sem_nem_kim_12@32";
    try {
      const payload = jwt.verify(refreshToken, JWT_SALT) as {id: string;role: string;};
      const { id, role } = payload;
      const newAccessToken = jwt.sign({ id, role }, JWT_SALT, {expiresIn: "15m",});
      return newAccessToken;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError("Refresh token has expired",HttpStatusCode.FORBIDDEN);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError("Invalid refresh token", HttpStatusCode.FORBIDDEN);
      }
      throw new AppError(
        "Error generating access token",HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  };

export const formatDate = (isoDate: Date | undefined | string) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = String(dateObj.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  export const dateFilterforChart = (period:'monthly'|'yearly'|'weekly') => {
    const now = new Date();
    const dateFilter = {
        'monthly': { 
            $gte: new Date(now.setMonth(now.getMonth() - 1))
         },
        'yearly': { 
            $gte: new Date(now.setFullYear(now.getFullYear() - 1))
         },
        'weekly': {
            $gte: new Date(now.setDate(now.getDate() - 7))
         },
      }
      return dateFilter[period];
  }

