export interface CartItem {
  _id?: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    // El backend popula el producto completo (ver cartController.js
    // getCart: .populate('items.product') sin proyección), así que
    // description sí viaja en la respuesta real aunque el resto de este
    // sub-tipo se mantuvo minimal en sub-fases anteriores. Se agrega acá,
    // opcional, para poder portar fielmente la tarjeta de carrito de
    // carrito.html (que sí la muestra) sin tocar otros consumidores de Cart.
    description?: string;
  };
  cantidad: number;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
}

export interface Appointment {
  _id: string;
  date: string;
  status?: 'pendiente' | 'realizada' | 'cancelada';
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  stock?: number | null;
  category: 'capilar' | 'facial' | '';
  type?: string;
  featured: boolean;
  availability: boolean;
  image?: string;
  createdAt?: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  comment: string;
  avatar: string;
  userId?: string;
  createdAt: string;
}

export interface OrderItem {
  product?: string;
  name: string;
  price: number;
  cantidad: number;
}

export interface Order {
  _id: string;
  user?: { name?: string; email?: string } | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  createdAt: string;
}

// Cupón ya validado contra el subtotal actual (respuesta de POST
// /api/coupons/validate) — subconjunto de los campos del Coupon completo que
// administra el panel de admin (ver admin-app/src/types/models.ts); el sitio
// público nunca ve _id/active/expiresAt porque el backend no los manda acá.
export interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
}

export interface PaymentCard {
  _id: string;
  plantilla: 'pichincha' | 'guayaquil';
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  titular: string;
  marca: 'visa' | 'mastercard';
  activa: boolean;
}
