import Product from "../models/product.model.js";

const TALLAS_VALIDAS = ['XS', 'S', 'M', 'L'];

export const totalcarrito = async (req, res) => {
  const { items } = req.body; // [{ id, quantity, talla }]

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ mensaje: "items debe ser un array no vacío" });
  }

  const ids = items.map(i => i.id);
  const productos = await Product.find({ _id: { $in: ids } });

  const errores = [];

  let total = 0;
  const lineItems = productos.map(p => {
    const item = items.find(i => i.id === p._id.toString());
    const qty  = item?.quantity || 1;
    const talla = item?.talla;

    if (!talla || !TALLAS_VALIDAS.includes(talla)) {
      errores.push(`Producto "${p.nombre}": talla inválida o no indicada`);
      return null;
    }

    const stockDisponible = p.tallas?.[talla] ?? 0;
    if (stockDisponible < qty) {
      errores.push(`Producto "${p.nombre}" talla ${talla}: solo quedan ${stockDisponible} unidades`);
      return null;
    }

    total += p.precio * qty;
    return { name: `${p.nombre} (${talla})`, price: p.precio, quantity: qty };
  }).filter(Boolean);

  if (errores.length > 0) {
    return res.status(400).json({ mensaje: "Error en el carrito", errores });
  }

  res.json({
    totalAMostrar: total,
    totalParaStripe: Math.round(total * 100),
    lineItems
  });
};

export const stripeWebhook = async (req, res) => {
  const evento = req.body;

  if (evento.type === 'checkout.session.completed') {
    const sesion = evento.data.object;
    console.log("✅ ¡Pago confirmado por Stripe!");
    console.log(`Cliente: ${sesion.customer_details.email}`);
    console.log(`Total pagado: ${sesion.amount_total / 100}€`);
  }

  res.status(200).json({ recibido: true });
};
