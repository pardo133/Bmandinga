import { Router } from 'express';
import { createCheckoutSessionHandler, getSessionStatusHandler, simulatePaymentHandler, } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/user.middleware.js';
const router = Router();
/** POST /api/checkout — crea sesión de Stripe y devuelve { url } */
router.post('/', authMiddleware, createCheckoutSessionHandler);
/** GET /api/checkout/session-status?session_id=cs_xxx */
router.get('/session-status', getSessionStatusHandler);
/**
 * POST /api/checkout/simulate-payment  [SOLO SANDBOX]
 * Dispara la lógica de pago completado sin necesitar la Stripe CLI.
 * Body opcional: { items: [{id, quantity}], total: number }
 */
router.post('/simulate-payment', authMiddleware, simulatePaymentHandler);
// El endpoint /webhook se registra en index.js antes de express.json()
// para que Stripe pueda verificar la firma sobre el body en crudo.
export default router;
