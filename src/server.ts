import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter';
import shopRouter from './routes/shopRouter';
import adminRouter from './routes/adminRouter';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import logger, { loggerhttp } from './middleware/logger';
import { pinoHttp } from 'pino-http';
import initializeCrons from './crons';
import { initializeSocket } from './socket/socketManager';
import { createServer } from 'http';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);

initializeSocket(server);

app.use(cors({
    origin:[process.env.ENDPORT_FRONTEND || '', process.env.ENDPORT_FRONTEND_LOCAL || ''],
    methods:['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials:true,
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  app.use(pinoHttp({logger:loggerhttp}));
    

// cronJob initialization
initializeCrons();

app.use('/public',express.static(path.join(__dirname,'../public')))

mongoose.connect(process.env.MONGODB_URI || '')
.then(() => logger.warn('MongoDB connected'))
.catch(err => logger.error('connectiong mongo error: ',err));


app.use('/admin',adminRouter)
app.use('/shop',shopRouter)
app.use('/',userRouter)

app.use(errorHandler)
  
server.listen(PORT, () => logger.warn(`Server running on port ${PORT}`));





