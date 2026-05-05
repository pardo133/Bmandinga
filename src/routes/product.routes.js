import express from "express";
import { getProducts, createProduct } from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/user.middleware.js";
import { totalcarrito } from "../controllers/cart.controllers.js";
const router = express.Router();


router.get("/", getProducts);
router.post("/carrito", totalcarrito);


router.post("/create", authMiddleware, (req, res, next) => {
    
  if (req.user.role !== 'admin') {
    return res.status(403).json({ mensaje: "Acceso denegado: No eres admin" });
  }
  next();
}, createProduct);

export default router;