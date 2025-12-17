
import { User, CartItem, Product } from '../types';

const BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:5000/');
      return response.ok;
    } catch (e) {
      return false;
    }
  },

  // --- Product Methods ---
  
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      // Map MongoDB _id to frontend id
      return data.map((p: any) => ({ ...p, id: p._id }));
    } catch (e) {
      console.error('Fetch products error:', e);
      return [];
    }
  },

  async seedInitialProducts(products: Product[]): Promise<void> {
    const token = localStorage.getItem('aaushop_token');
    for (const product of products) {
      try {
        await fetch(`${BASE_URL}/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            tags: product.tags,
            currency: product.currency
          }),
        });
      } catch (e) {
        console.error(`Failed to seed ${product.name}`, e);
      }
    }
  },

  // --- User & Auth Methods ---

  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Database authentication failed');
    }

    const data = await response.json();
    const user: User = {
      ...data,
      id: data._id,
      role: data.email === 'eyuzeed26@gmail.com' ? 'admin' : 'user'
    };
    
    if (data.token) localStorage.setItem('aaushop_token', data.token);
    return user;
  },

  async register(username: string, email: string, password: string, initialCart: CartItem[]): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    const user: User = {
      ...data,
      id: data._id,
      cart: initialCart,
      role: data.email === 'eyuzeed26@gmail.com' ? 'admin' : 'user'
    };

    if (data.token) localStorage.setItem('aaushop_token', data.token);
    await this.syncCart(user.id, initialCart);
    return user;
  },

  async syncCart(userId: string, cart: CartItem[]): Promise<void> {
    const token = localStorage.getItem('aaushop_token');
    if (!token) return;
    try {
      await fetch(`${BASE_URL}/users/cart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart }),
      });
    } catch (e) {
      console.error('Cart sync failed', e);
    }
  },

  async getAllUsers(): Promise<User[]> {
    const token = localStorage.getItem('aaushop_token');
    if (!token) return [];
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((u: any) => ({
        ...u,
        id: u._id,
        role: u.email === 'eyuzeed26@gmail.com' ? 'admin' : 'user'
      }));
    } catch (e) {
      return [];
    }
  }
};
