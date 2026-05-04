import express from 'express';
import { connectDB } from './src/config/db.js';
import userRoutes from './src/routes/user.routes.js';
import productRoutes from "./src/routes/product.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use("/api/products", productRoutes);


app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});