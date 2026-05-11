import express from 'express';
import {
    register,
    loginController,
    userInfoController,
    updateProfileController,
    refreshTokenController,
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginController);
router.get('/info', authMiddleware, userInfoController);
router.put('/profile', authMiddleware, updateProfileController);
router.get('/refresh', authMiddleware, refreshTokenController);

export default router;