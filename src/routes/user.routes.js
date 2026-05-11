import express from 'express';
import {
    register,
    loginController,
    userInfoController,
    updateProfileController,
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginController);
router.get('/info', authMiddleware, userInfoController);
router.put('/profile', authMiddleware, updateProfileController);

export default router;