import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    await nuevoProducto.save();
    res.status(201).json({ mensaje: "Producto creado con éxito", producto: nuevoProducto });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear producto" });
  }
};