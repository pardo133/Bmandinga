import mongoose from "mongoose";
const tallasSchema = new mongoose.Schema({
    XS: { type: Number, default: 0 },
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 }
}, { _id: false });
const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String },
    tallas: { type: tallasSchema, default: () => ({ XS: 0, S: 0, M: 0, L: 0 }) },
    categoria: {
        type: String,
        required: true,
        enum: ['Leggings', 'Camisetas', 'Zapatillas']
    },
    imagen: { type: String }
});
export default mongoose.model('product', productSchema, 'products');
