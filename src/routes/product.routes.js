import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/user.middleware.js";
import { totalcarrito } from "../controllers/cart.controllers.js";
import { stripeWebhook } from "../controllers/cart.controllers.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/carrito", totalcarrito);
router.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

router.post("/create", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
