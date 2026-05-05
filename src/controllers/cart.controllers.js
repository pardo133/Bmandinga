import product from "../models/product.model.js";

// Tu función actual para el total
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

// --- EL WEBHOOK DEL COMPAÑERO B EMPIEZA AQUÍ ---
export const stripeWebhook = async (req, res) => {
    // Stripe nos envía el aviso en el body
    const evento = req.body;

    // Solo nos importa si el pago se ha completado
    if (evento.type === 'checkout.session.completed') {
        const sesion = evento.data.object;
        
        console.log("✅ ¡Pago confirmado por Stripe!");
        console.log(`Cliente: ${sesion.customer_details.email}`);
        console.log(`Total pagado: ${sesion.amount_total / 100}€`);

        // Aquí es donde actualizarías tu base de datos en el futuro
    }

    // Siempre hay que responder a Stripe con un 200 (OK) para que no reintente
    res.status(200).json({ recibido: true });
};