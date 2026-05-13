import { Router } from 'express';
import { createCheckoutSessionHandler, getSessionStatusHandler, simulatePaymentHandler, } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/user.middleware.js';
const router = Router();

router.post('/', authMiddleware, createCheckoutSessionHandler);

router.get('/session-status', getSessionStatusHandler);

 
 
router.post('/simulate-payment', authMiddleware, simulatePaymentHandler);

export default router;
