
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  rating: number;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  cart: CartItem[];
  role: 'user' | 'admin';
}

export interface SearchResult {
  recommendedProducts: string[];
  explanation: string;
}

export enum Category {
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOME = 'Home & Living',
  GADGETS = 'Gadgets',
  WELLNESS = 'Wellness'
}
