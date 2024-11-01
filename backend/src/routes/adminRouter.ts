import express from 'express';
import { addShop, shopdetails, toggleStatus, userDetails } from '../controllers/adminController';


const router = express.Router();

// router.post('/login', async (req,res)=> {login(req,res)});
// router.get('/', async (req,res)=> {await loginget(req,res)});
router.get('/users', async (req,res)=> {await userDetails(req,res)});
router.patch('/user/:id', async (req,res)=> {await toggleStatus(req,res)});
router.get('/shopdetails', async (req,res)=> {await shopdetails(req,res)});
router.post('/addShop', async (req,res)=> {await addShop(req,res)});


export default router;