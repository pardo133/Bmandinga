import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/user.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { totalcarrito, stripeWebhook } from "../controllers/cart.controllers.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/carrito", totalcarrito);
router.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

router.post("/create", authMiddleware, adminMiddleware, upload.single("imagen"), createProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("imagen"), updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
