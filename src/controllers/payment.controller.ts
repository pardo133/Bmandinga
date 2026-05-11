import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { createCheckoutSession, retrieveSessionStatus } from '../services/payment.service.js';
import type { CheckoutItem, WebhookOrderData, OrderProduct } from '../types/payment.types.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// ─── Checkout session ─────────────────────────────────────────────────────────

export async function createCheckoutSessionHandler(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'Usuario no autenticado' });
    return;
  }

  const { items } = req.body as { items: unknown };

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: 'items debe ser un array no vacío' });
    return;
  }

  const isValid = (items as CheckoutItem[]).every(
    (i) =>
      (typeof i.id === 'string' || typeof i.id === 'number') &&
      typeof i.nombre === 'string' &&
      typeof i.precio === 'number' && i.precio >= 0 &&
      typeof i.cantidad === 'number' && Number.isInteger(i.cantidad) && i.cantidad > 0
  );
  if (!isValid) {
    res.status(400).json({
      message: 'Cada item debe tener id, nombre, precio (número) y cantidad (entero > 0)',
    });
    return;
  }

  try {
    const result = await createCheckoutSession(items as CheckoutItem[], userId);
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    res.status(500).json({ message });
  }
}

// ─── Session status ───────────────────────────────────────────────────────────

/** GET /api/checkout/session-status?session_id=cs_xxx */
export async function getSessionStatusHandler(
  req: Request,
  res: Response
): Promise<void> {
  const sessionId = req.query['session_id'];

  if (typeof sessionId !== 'string' || !sessionId) {
    res.status(400).json({ message: 'Falta el parámetro session_id' });
    return;
  }

  try {
    const status = await retrieveSessionStatus(sessionId);
    res.status(200).json(status);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    res.status(500).json({ message });
  }
}

// ─── Webhook ──────────────────────────────────────────────────────────────────

/**
 * Registrado en index.js ANTES de express.json() con express.raw({ type: 'application/json' })
 * para preservar el body en crudo que Stripe necesita para verificar la firma.
 */
export async function webhookHandler(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).json({ message: 'Falta la cabecera stripe-signature' });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error de firma';
    console.error('Webhook: verificación de firma fallida:', message);
    res.status(400).json({ message: `Webhook error: ${message}` });
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    default:
      console.log(`Evento de Stripe no manejado: ${event.type}`);
  }

  res.status(200).json({ received: true });
}

// ─── Lógica de negocio del webhook ───────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.client_reference_id ?? 'unknown';

  const productsRaw = session.metadata?.products ?? '';
  const products: OrderProduct[] = productsRaw
    .split(',')
    .filter(Boolean)
    .map((entry) => {
      const [productId, qty] = entry.split(':');
      return { productId, quantity: Number(qty) };
    });

  const orderData: WebhookOrderData = {
    userId,
    sessionId: session.id,
    products,
    total: (session.amount_total ?? 0) / 100,
  };

  // ── SIMULACIÓN — reemplazar por lógica real de DB ────────────────────────────
  //   await Order.create({ ...orderData, status: 'completed', createdAt: new Date() });
  //   await Cart.deleteOne({ userId });
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('✅ Pago confirmado. Orden simulada:', JSON.stringify(orderData, null, 2));
  console.log(`🛒 Carrito simulado limpiado para usuario: ${userId}`);
}
