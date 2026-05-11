import Stripe from 'stripe';
import product from '../models/product.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { items } = req.body; // [{ id, quantity }]

        const ids = items.map(i => i.id);
        const productos = await product.find({ _id: { $in: ids } });

        const lineItems = productos.map(p => {
            const item = items.find(i => i.id === p._id.toString());
            const qty = item?.quantity || 1;
            return {
                price_data: {
                    currency: 'eur',
                    product_data: { name: p.nombre },
                    unit_amount: Math.round(p.precio * 100),
                },
                quantity: qty,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error en Stripe:", error);
        res.status(500).json({ error: 'Error al crear la sesión' });
    }
};
