import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { createCheckoutSession, retrieveSessionStatus } from '../services/payment.service.js';
import type { CheckoutItem, WebhookOrderData, OrderProduct } from '../types/payment.types.js';
import Product from '../models/product.model.js';

const TALLAS_VALIDAS = ['XS', 'S', 'M', 'L'] as const;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type StripeEvent = ReturnType<typeof stripe.webhooks.constructEvent>;
type StripeCheckoutSession = Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>;



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
      typeof i.cantidad === 'number' && Number.isInteger(i.cantidad) && i.cantidad > 0 &&
      TALLAS_VALIDAS.includes(i.talla as typeof TALLAS_VALIDAS[number])
  );
  if (!isValid) {
    res.status(400).json({
      message: 'Cada item debe tener id, nombre, precio (número), cantidad (entero > 0) y talla (XS/S/M/L)',
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



export async function webhookHandler(req: Request, res: Response): Promise<void> {
  
  console.log('\n🔔 [WEBHOOK] Petición recibida:', new Date().toISOString());

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ [WEBHOOK] STRIPE_WEBHOOK_SECRET no está definido en .env');
    res.status(500).json({ message: 'Configuración de webhook incompleta en el servidor' });
    return;
  }

  const rawSig = req.headers['stripe-signature'];
  const sig = Array.isArray(rawSig) ? rawSig[0] : rawSig;

  if (!sig) {
    console.error('❌ [WEBHOOK] Falta la cabecera stripe-signature');
    res.status(400).json({ message: 'Falta la cabecera stripe-signature' });
    return;
  }

  let event: StripeEvent;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error de firma';
    console.error('❌ [WEBHOOK] Firma inválida:', message);
    res.status(400).json({ message: `Webhook error: ${message}` });
    return;
  }

  console.log('✅ [WEBHOOK] Evento verificado:', event.type);

  if (event.type === 'checkout.session.completed') {
    await handleCheckoutCompleted(event.data.object as StripeCheckoutSession);
  }

  res.status(200).json({ received: true });
}



export async function simulatePaymentHandler(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.id ?? 'usuario-simulado';
  const { items = [], total = 9.99 } = req.body as {
    items?: Array<{ id: string | number; quantity: number; talla?: string }>;
    total?: number;
  };

  const mockSession: Partial<StripeCheckoutSession> = {
    id: `cs_test_simulado_${Date.now()}`,
    client_reference_id: userId,
    amount_total: Math.round(total * 100),
    metadata: {
      products: items.map((i) => `${i.id}:${i.quantity}:${i.talla ?? ''}`).join(','),
    },
    customer_details: { email: 'test@sandbox.local' } as StripeCheckoutSession['customer_details'],
  };

  await handleCheckoutCompleted(mockSession as StripeCheckoutSession);

  res.status(200).json({
    message: 'Pago simulado procesado. Revisa la consola del servidor.',
    sessionId: mockSession.id,
  });
}



async function handleCheckoutCompleted(session: StripeCheckoutSession): Promise<void> {
  const userId = session.client_reference_id ?? 'unknown';
  const email  = session.customer_details?.email ?? 'sin email';

  const productsRaw = session.metadata?.products ?? '';
  const products: OrderProduct[] = productsRaw
    .split(',')
    .filter(Boolean)
    .map((entry: string) => {
      const [productId, qty, talla] = entry.split(':');
      return { productId, quantity: Number(qty), talla: talla ?? '' };
    });

  const orderData: WebhookOrderData = {
    userId,
    sessionId: session.id,
    products,
    total: (session.amount_total ?? 0) / 100,
  };

  console.log('\n========================================');
  console.log('✅  PAGO CONFIRMADO');
  console.log('========================================');
  console.log(`👤 Usuario  : ${userId}`);
  console.log(`📧 Email    : ${email}`);
  console.log(`💶 Total    : ${orderData.total.toFixed(2)} €`);
  console.log(`🛒 Productos: ${JSON.stringify(products)}`);
  console.log('========================================\n');

  
  for (const { productId, quantity, talla } of products) {
    if (!talla) continue;
    await Product.findByIdAndUpdate(productId, {
      $inc: { [`tallas.${talla}`]: -quantity },
    });
  }


}
