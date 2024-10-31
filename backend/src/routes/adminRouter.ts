import express from 'express';
import { toggleStatus, userDetails } from '../controllers/adminController';


const router = express.Router();

// router.post('/login', async (req,res)=> {login(req,res)});
// router.get('/', async (req,res)=> {await loginget(req,res)});
router.get('/users', async (req,res)=> {await userDetails(req,res)});
router.patch('/user/:id', async (req,res)=> {await toggleStatus(req,res)});


export default router;