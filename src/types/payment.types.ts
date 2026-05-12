/** Producto enviado por el cliente — shape del CartItem del front */
export interface CheckoutItem {
  id: string | number;
  nombre: string;
  precio: number;   // precio del carrito, en euros (se multiplica × 100 para Stripe)
  cantidad: number;
  talla: 'XS' | 'S' | 'M' | 'L';
}

/** Producto tal como viene de MongoDB (para uso futuro) */
export interface IProductDoc {
  _id: { toString(): string };
  nombre: string;
  precio: number;
  tallas: { XS: number; S: number; M: number; L: number };
}

/** Respuesta al crear una sesión de Stripe Checkout */
export interface CheckoutSessionResponse {
  url: string;
}

/** Estado de la sesión — endpoint GET /checkout/session-status */
export interface SessionStatusResponse {
  status: 'paid' | 'unpaid' | 'no_payment_required';
  customerEmail: string | null;
  amountTotal: number | null;   // en céntimos, igual que lo devuelve Stripe
  currency: string | null;
}

/** Producto dentro de una orden */
export interface OrderProduct {
  productId: string;
  quantity: number;
  talla: string;
}

/** Datos que componen la orden al recibir el webhook de Stripe */
export interface WebhookOrderData {
  userId: string;
  sessionId: string;
  products: OrderProduct[];
  total: number;
}
