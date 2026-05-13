
export interface CheckoutItem {
  id: string | number;
  nombre: string;
  precio: number;   
  cantidad: number;
  talla: 'XS' | 'S' | 'M' | 'L';
}


export interface IProductDoc {
  _id: { toString(): string };
  nombre: string;
  precio: number;
  tallas: { XS: number; S: number; M: number; L: number };
}


export interface CheckoutSessionResponse {
  url: string;
}


export interface SessionStatusResponse {
  status: 'paid' | 'unpaid' | 'no_payment_required';
  customerEmail: string | null;
  amountTotal: number | null;   
  currency: string | null;
}


export interface OrderProduct {
  productId: string;
  quantity: number;
  talla: string;
}


export interface WebhookOrderData {
  userId: string;
  sessionId: string;
  products: OrderProduct[];
  total: number;
}
