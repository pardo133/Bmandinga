import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import userRoutes from './src/routes/user.routes.js';
import productRoutes from './src/routes/product.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import checkoutRoutes from './src/routes/checkout.routes.js';
import { webhookHandler } from './src/controllers/payment.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true,
}));

// El webhook de Stripe necesita el body en crudo (Buffer) para verificar la firma.
// DEBE registrarse antes que express.json(), que consumiría el stream.
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  webhookHandler
);

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/checkout', checkoutRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});