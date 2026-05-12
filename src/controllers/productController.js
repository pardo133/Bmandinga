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
    const { nombre, precio, descripcion, stock, categoria } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : undefined;

    const nuevoProducto = new Product({ nombre, precio, descripcion, stock, categoria, imagen });
    await nuevoProducto.save();

    res.status(201).json({ mensaje: "Producto creado con éxito", producto: nuevoProducto });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear producto", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, stock, categoria } = req.body;

    const updates = {};
    if (nombre     !== undefined) updates.nombre     = nombre;
    if (precio     !== undefined) updates.precio     = precio;
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (stock      !== undefined) updates.stock      = stock;
    if (categoria  !== undefined) updates.categoria  = categoria;
    if (req.file) updates.imagen = `/uploads/${req.file.filename}`;

    const producto = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    res.status(200).json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Product.findByIdAndDelete(id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    res.status(200).json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
  }
};
