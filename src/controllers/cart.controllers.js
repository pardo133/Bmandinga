import product from "../models/product.model.js";

export const totalcarrito = async (req, res) => {
    const { items } = req.body; // [{ id, quantity }]
    const ids = items.map(i => i.id);
    const productos = await product.find({ _id: { $in: ids } });

    let total = 0;
    const lineItems = productos.map(p => {
        const item = items.find(i => i.id === p._id.toString());
        const qty = item?.quantity || 1;
        total += p.precio * qty;
        return { name: p.nombre, price: p.precio, quantity: qty };
    });

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
