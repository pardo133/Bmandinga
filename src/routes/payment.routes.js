import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController.js';
import { stripeWebhook } from '../controllers/cart.controllers.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', stripeWebhook);

export default router;