import product from "../models/product.model.js";
export const totalcarrito = async (req, res) => {
  const { ids } = req.body;
  const productos = await product.find({ _id: { $in: ids } });
  let total = 0;
  productos.forEach(p => total += p.precio);
  res.json({
    totalAMostrar: total,
    totalParaStripe: total * 100 
  });
};
