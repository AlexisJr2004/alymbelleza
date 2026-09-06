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
