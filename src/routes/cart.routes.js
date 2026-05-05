import express from 'express';
import { totalcarrito } from '../controllers/cart.controllers.js';
const router = express.Router();
router.post("/carrito", totalcarrito);
export default router;