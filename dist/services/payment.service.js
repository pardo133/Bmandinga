import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';
/**
 * Crea una sesión de Stripe Checkout.
 * Usa el precio enviado por el cliente (ya validado en el front al añadir al carrito).
 */
export async function createCheckoutSession(items, userId) {
    const lineItems = items.map((i) => ({
        price_data: {
            currency: 'eur',
            product_data: { name: `${i.nombre} (Talla ${i.talla})` },
            unit_amount: Math.round(i.precio * 100),
        },
        quantity: i.cantidad,
    }));
    // Serializar items en metadata: "id:cantidad:talla,..."
    const productsMetadata = items.map((i) => `${i.id}:${i.cantidad}:${i.talla}`).join(',');
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        client_reference_id: userId,
        metadata: { products: productsMetadata },
        success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${CLIENT_URL}/checkout`,
    });
    if (!session.url) {
        throw new Error('Stripe no devolvió una URL de sesión');
    }
    return { url: session.url };
}

export async function retrieveSessionStatus(sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
        status: session.payment_status,
        customerEmail: session.customer_details?.email ?? null,
        amountTotal: session.amount_total, 
        currency: session.currency ?? null,
    };
}
