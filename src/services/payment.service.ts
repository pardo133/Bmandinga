import Stripe from 'stripe';
import type {
  CheckoutItem,
  CheckoutSessionResponse,
  SessionStatusResponse,
} from '../types/payment.types.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

/**
 * Crea una sesión de Stripe Checkout.
 * Usa el precio enviado por el cliente (ya validado en el front al añadir al carrito).
 */
export async function createCheckoutSession(
  items: CheckoutItem[],
  userId: string
): Promise<CheckoutSessionResponse> {
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
    cancel_url:  `${CLIENT_URL}/checkout`,
  });

  if (!session.url) {
    throw new Error('Stripe no devolvió una URL de sesión');
  }

  return { url: session.url };
}

/** Recupera el estado de pago de una sesión de Stripe para la página de éxito */
export async function retrieveSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return {
    status:        session.payment_status,
    customerEmail: session.customer_details?.email ?? null,
    amountTotal:   session.amount_total,   // en céntimos, igual que lo devuelve Stripe
    currency:      session.currency ?? null,
  };
}
