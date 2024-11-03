import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter';
import shopRouter from './routes/shopRouter';
import adminRouter from './routes/adminRouter';
// import loginRouter from './routes/loginRouter';
import path from 'path';

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin:['http://192.168.1.3:5173','http://localhost:5173'],
    methods:['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials:true,
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/public',express.static(path.join(__dirname,'../public')))

mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('connectiong mongo error: ',err));


app.use('/admin',adminRouter)
app.use('/shop',shopRouter)
// app.use('/login',loginRouter)

app.use('/',userRouter)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
