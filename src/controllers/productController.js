import Product from "../models/product.model.js";

const TALLAS_VALIDAS = ['XS', 'S', 'M', 'L'];

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const isAdmin = req.user?.role === 'admin';

    const result = products.map(p => {
      const obj = p.toObject();
      if (!isAdmin) {
        
        obj.tallasDisponibles = TALLAS_VALIDAS.filter(t => (p.tallas?.[t] ?? 0) > 0);
        delete obj.tallas;
      }
      return obj;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, categoria } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : undefined;

    const tallas = parseTallas(req.body);

    const nuevoProducto = new Product({ nombre, precio, descripcion, tallas, categoria, imagen });
    await nuevoProducto.save();

    res.status(201).json({ mensaje: "Producto creado con éxito", producto: nuevoProducto });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear producto", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, categoria } = req.body;

    const updates = {};
    if (nombre      !== undefined) updates.nombre      = nombre;
    if (precio      !== undefined) updates.precio      = precio;
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (categoria   !== undefined) updates.categoria   = categoria;
    if (req.file) updates.imagen = `/uploads/${req.file.filename}`;

    const tallasUpdate = parseTallas(req.body);
    if (Object.keys(tallasUpdate).length > 0) {
      updates.tallas = tallasUpdate;
    }

    const producto = await Product.findByIdAndUpdate(id, updates, { returnDocument: 'after', runValidators: true });
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


function parseTallas(body) {
  if (body.tallas) {
    let tallas = body.tallas;
    if (typeof tallas === 'string') {
      try { tallas = JSON.parse(tallas); } catch { tallas = {}; }
    }
    if (typeof tallas === 'object') {
      const t = {};
      for (const k of TALLAS_VALIDAS) {
        if (tallas[k] !== undefined) t[k] = Number(tallas[k]);
      }
      return t;
    }
  }

  const t = {};
  for (const k of TALLAS_VALIDAS) {
    const val = body[`talla_${k}`];
    if (val !== undefined) t[k] = Number(val);
  }
  return t;
}
