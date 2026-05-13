import { Router } from 'express';
import { createCheckoutSessionHandler } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/user.middleware.js';
const router = Router();

router.post('/create-checkout-session', authMiddleware, createCheckoutSessionHandler);

export default router;
