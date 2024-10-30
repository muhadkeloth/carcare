import express from 'express';
import { signup } from '../controllers/userController';

const router = express.Router();

// router.post('/login', async (req,res)=> {login(req,res)});
router.post('/signup', async (req,res)=> {await signup(req,res)});


export default router;


// import express from 'express';
// import { authenticateToken } from '../middleware/auth';

// const router = express.Router();

// router.get('/protected', authenticateToken, (req, res) => {
//     res.json({ message: 'This is a protected route' });
// });

// export default router;
