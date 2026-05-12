import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String },
  stock: { type: Number, default: 0 },
  categoria: {
    type: String,
    required: true,
    enum: ['Leggings', 'Camisetas', 'Zapatillas']
  },
  imagen: { type: String }
});

export default mongoose.model('product', productSchema, 'products');
