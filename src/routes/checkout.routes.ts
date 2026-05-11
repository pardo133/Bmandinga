import { Router } from 'express';
import {
  createCheckoutSessionHandler,
  getSessionStatusHandler,
} from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/user.middleware.js';

const router = Router();

/**
 * POST /api/checkout
 * Body: { items: Array<{ id, nombre, precio, cantidad }> }
 * Requiere JWT. Devuelve { url: string } para redirigir a Stripe.
 */
router.post('/', authMiddleware, createCheckoutSessionHandler);

/**
 * GET /api/checkout/session-status?session_id=cs_xxx
 * Ruta pública — Stripe redirige al front con session_id en la URL de éxito.
 */
router.get('/session-status', getSessionStatusHandler);

export default router;
