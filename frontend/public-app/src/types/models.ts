export interface CartItem {
  _id?: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
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
