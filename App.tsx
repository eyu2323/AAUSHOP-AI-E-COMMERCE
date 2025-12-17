
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import VisualSearchModal from './components/VisualSearchModal';
import AdminDashboard from './components/AdminDashboard';
import AuthPage from './AuthPage';
import { Product, CartItem, Category, User } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { geminiService } from './services/geminiService';
import { apiService } from './services/apiService';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isOnline, setIsOnline] = useState(false);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // Connection Health Check
  useEffect(() => {
    const checkConnection = async () => {
      const status = await apiService.checkHealth();
      setIsOnline(status);
    };
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Live Products from MongoDB
  const loadProducts = useCallback(async () => {
    const dbProducts = await apiService.getProducts();
    if (dbProducts.length > 0) {
      setProducts(dbProducts);
    }
  }, []);

  useEffect(() => {
    if (isOnline) loadProducts();
  }, [isOnline, loadProducts]);

  // Initial Load User State
  useEffect(() => {
    const savedUser = localStorage.getItem('aaushop_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setCartItems(parsedUser.cart || []);
      } catch (e) {
        localStorage.removeItem('aaushop_user');
      }
    } else {
      const guestCart = localStorage.getItem('aaushop_guest_cart');
      if (guestCart) setCartItems(JSON.parse(guestCart));
    }
  }, []);

  // Sync Cart
  useEffect(() => {
    if (user) {
      apiService.syncCart(user.id, cartItems);
      const updatedUser = { ...user, cart: cartItems };
      localStorage.setItem('aaushop_user', JSON.stringify(updatedUser));
    } else {
      localStorage.setItem('aaushop_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim().length > 0) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return result;
  }, [products, activeCategory, searchQuery]);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    localStorage.clear();
  };

  const handleUserLogin = (userData: User) => {
    setUser(userData);
    setCartItems(userData.cart);
  };

  return (
    <div className="min-h-screen bg-[#fafbff] flex flex-col">
      <Navbar 
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
        searchQuery={searchQuery}
        isOnline={isOnline}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          {user ? (
            <div className="flex items-center gap-4 bg-white p-2 pr-2 rounded-3xl shadow-sm border border-slate-100 group animate-fade-in">
              <div className="flex items-center gap-4 pl-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-all">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-black text-slate-900">{user.username}</p>
                    {user.role === 'admin' && (
                      <span className="bg-indigo-100 text-indigo-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Admin</span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Verified Explorer</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                {user.role === 'admin' && (
                  <button 
                    onClick={() => setIsAdminOpen(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 flex items-center gap-2 group/btn"
                  >
                    <svg className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Management Hub
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
              Establish Connection
            </button>
          )}
        </div>

        {/* Hero Section */}
        <div className="relative rounded-[4rem] bg-indigo-950 overflow-hidden mb-20 p-20 text-center text-white shadow-2xl animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-fixed"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none uppercase">WELCOME <br/><span className="text-indigo-400">AAUSHOP</span></h1>
            <p className="text-indigo-200 text-xl md:text-2xl mb-12 font-medium leading-relaxed opacity-80">
              Your premium AI-native marketplace connected to a high-performance MongoDB global architecture. Seamless, secure, and smart shopping.
            </p>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-6 no-scrollbar">
          {['All', ...Object.values(Category)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-110' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <VisualSearchModal 
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        onAnalyze={async (img) => {
          setIsAnalyzingImage(true);
          const res = await geminiService.analyzeImageForSearch(img);
          setSearchQuery(res.searchQuery);
          setIsVisualSearchOpen(false);
          setIsAnalyzingImage(false);
        }}
        isAnalyzing={isAnalyzingImage}
      />

      {isAuthOpen && (
        <AuthPage 
          onLogin={handleUserLogin}
          onClose={() => setIsAuthOpen(false)}
          guestCart={cartItems}
        />
      )}

      {isAdminOpen && (
        <AdminDashboard 
          products={products}
          onClose={() => {
            setIsAdminOpen(false);
            loadProducts(); // Refresh products after potentially seeding
          }}
        />
      )}
    </div>
  );
};

export default App;
