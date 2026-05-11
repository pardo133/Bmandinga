import { Router } from 'express';
import { createCheckoutSessionHandler } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/user.middleware.js';

const router = Router();

/**
 * POST /api/payments/create-checkout-session
 * Body: { items: Array<{ id: string; quantity: number }> }
 * Requiere JWT de usuario autenticado.
 */
router.post('/create-checkout-session', authMiddleware, createCheckoutSessionHandler);

// El endpoint /webhook se registra directamente en index.js antes de express.json()
// para que Stripe pueda verificar la firma sobre el body en crudo.

export default router;
