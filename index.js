import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { connectDB } from './src/config/db.js';
import userRoutes from './src/routes/user.routes.js';
import productRoutes from './src/routes/product.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import checkoutRoutes from './src/routes/checkout.routes.js';
import { webhookHandler } from './src/controllers/payment.controller.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true,
}));


app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  webhookHandler
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/checkout', checkoutRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

export default app;
