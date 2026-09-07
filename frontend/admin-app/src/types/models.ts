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

export interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  role: 'cliente' | 'admin';
  isActive?: boolean;
  profileImage?: string;
  createdAt: string;
}

export interface Appointment {
  _id: string;
  user?: { name?: string; email?: string } | null;
  date: string;
  status?: 'pendiente' | 'realizada' | 'cancelada';
}

export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  active: boolean;
  expiresAt?: string | null;
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
