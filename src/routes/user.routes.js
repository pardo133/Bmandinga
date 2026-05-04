import express from 'express';
import { register, loginController, userInfoController } from '../controllers/userController.js';
import { authMiddleware } from '../middelware/middelware.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', register);
router.post('/info', authMiddleware, userInfoController);

export default router;