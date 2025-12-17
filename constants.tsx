
import { Product, Category } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'inf-1',
    name: 'Infinix Note 40 Pro',
    description: 'Ultra-fast 70W All-Round FastCharge with 120Hz AMOLED Curved Display. High-performance gaming and photography monster.',
    price: 34500,
    currency: 'ETB',
    category: Category.ELECTRONICS,
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    tags: ['infinix', 'smartphone', 'fastcharge', 'gaming']
  },
  {
    id: 'inf-2',
    name: 'Infinix Zero 30 5G',
    description: 'Master the cinematic with 4K 60FPS video recording and 144Hz 3D Curved AMOLED Display.',
    price: 42000,
    currency: 'ETB',
    category: Category.ELECTRONICS,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    tags: ['infinix', 'flagship', 'camera', '5G']
  },
  {
    id: 'inf-3',
    name: 'Infinix Hot 40i',
    description: 'The ultimate entertainment device with a 90Hz Super Bright Display and 5000mAh long-lasting battery.',
    price: 18900,
    currency: 'ETB',
    category: Category.ELECTRONICS,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    tags: ['infinix', 'affordable', 'battery', 'tech']
  },
  {
    id: 'fashion-1',
    name: 'Urban Techshell Jacket',
    description: 'Waterproof, breathable, and equipped with smart heating elements for extreme comfort.',
    price: 185.00,
    currency: 'USD',
    category: Category.FASHION,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    tags: ['apparel', 'techwear', 'outdoor']
  },
  {
    id: 'home-1',
    name: 'Aura Floating Moon Lamp',
    description: 'Magnetic levitation technology with touch-controlled lunar phases and warm glow.',
    price: 129.00,
    currency: 'USD',
    category: Category.HOME,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    tags: ['decor', 'minimalist', 'lighting']
  },
  {
    id: 'well-1',
    name: 'ZenPulse Massage Gun',
    description: 'Professional grade percussive therapy with ultra-quiet brushless motor and 6 speed levels.',
    price: 249.00,
    currency: 'USD',
    category: Category.WELLNESS,
    image: 'https://images.unsplash.com/photo-1544117518-2b462fca5172?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    tags: ['recovery', 'fitness', 'wellness']
  },
  {
    id: 'gadget-1',
    name: 'Nova VR Pro Headset',
    description: 'Immersive 8K resolution with haptic feedback controllers and wireless streaming capabilities.',
    price: 599.00,
    currency: 'USD',
    category: Category.GADGETS,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    tags: ['metaverse', 'gaming', 'next-gen']
  },
  {
    id: 'audio-1',
    name: 'AeroPulse Wireless Headphones',
    description: 'Next-generation noise cancellation with immersive spatial audio technology.',
    price: 299.99,
    currency: 'USD',
    category: Category.ELECTRONICS,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    tags: ['wireless', 'audio', 'premium']
  }
];
