import express from 'express';
import userRoutes from './src/routes/user.route.js';
import { connectDB } from './src/config/db.config.js'; 

const app = express();
const PORT = 3000;

connectDB(); 

app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/test', (req, res) => {
  res.json({ message: 'API is working', status: 'ok' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});