
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, CartItem } from '../types';
import { apiService } from '../services/apiService';
import { INITIAL_PRODUCTS } from '../constants';

interface AdminDashboardProps {
  onClose: () => void;
  products: Product[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, products }) => {
  const [activeTab, setActiveTab] = useState<'database' | 'inventory' | 'analytics'>('database');
  const [users, setUsers] = useState<User[]>([]);
  const [inspectUser, setInspectUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected'>('connecting');
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await apiService.getAllUsers();
      setUsers(data);
      setDbStatus('connected');
    };
    fetchUsers();
  }, []);

  const handleSeedProducts = async () => {
    setIsSeeding(true);
    await apiService.seedInitialProducts(INITIAL_PRODUCTS);
    setIsSeeding(false);
    alert('Database Seeded Successfully! Refreshing inventory...');
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [users, searchTerm]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCartValue = (cart: CartItem[]) => {
    const totals: Record<string, number> = {};
    cart.forEach(item => {
      totals[item.currency] = (totals[item.currency] || 0) + (item.price * item.quantity);
    });
    return Object.entries(totals).map(([curr, val]) => 
      `${val.toLocaleString()} ${curr === 'ETB' ? 'ብር' : curr}`
    ).join(' + ') || 'Empty';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col overflow-hidden animate-fade-in text-slate-900">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              A
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">AauShop Console</h1>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">
                  Cluster Status: {dbStatus === 'connected' ? 'Active' : 'Initializing...'}
                </p>
              </div>
            </div>
          </div>
          
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('database')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'database' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              User Database
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Inventory Schema
            </button>
          </nav>
        </div>

        <button 
          onClick={onClose}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Exit Console
        </button>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {activeTab === 'database' ? (
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-1">Database Explorer</h2>
                  <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">Collection: users</p>
                </div>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search Cluster Index..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border border-slate-200 rounded-2xl py-3 px-12 text-sm w-full md:w-80 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
                  <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">_id</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cart</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6">
                           <code className="bg-slate-100 px-2 py-1 rounded text-[9px] font-mono text-slate-500">
                             {user.id.substring(0, 12)}...
                           </code>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              {user.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 leading-none mb-1">{user.username}</p>
                              <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-8 py-6 text-xs font-black text-indigo-600">
                          {getCartValue(user.cart)}
                        </td>
                        <td className="px-8 py-6">
                          <button 
                            onClick={() => setInspectUser(user)}
                            className="bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
               <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-1">Inventory Collection</h2>
                  <p className="text-slate-500 font-medium">Push static data to MongoDB Cloud</p>
                </div>
                <button 
                  onClick={handleSeedProducts}
                  disabled={isSeeding}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-3"
                >
                  {isSeeding ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  )}
                  {isSeeding ? 'Writing to MongoDB...' : 'Seed Global Database'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm flex gap-6 items-center hover:shadow-md transition-all group">
                    <div className="w-24 h-24 rounded-3xl bg-slate-50 overflow-hidden flex-shrink-0 shadow-inner">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 truncate mb-1">{product.name}</h4>
                      <p className="text-sm text-indigo-600 font-black mb-2">
                        {product.currency === 'ETB' ? `${product.price.toLocaleString()} ብር` : `$${product.price}`}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500 font-black uppercase tracking-widest">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {inspectUser && (
          <div className="w-full md:w-[450px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-fade-in">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-6">
                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black">
                  {inspectUser.username[0].toUpperCase()}
                </div>
                <button onClick={() => setInspectUser(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{inspectUser.username}</h3>
              <p className="text-slate-400 text-sm mb-4">{inspectUser.email}</p>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Valuation</span>
                <span className="text-lg font-black text-indigo-600">{getCartValue(inspectUser.cart)}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Cart Documents</h4>
              <div className="space-y-4">
                {inspectUser.cart.length > 0 ? (
                  inspectUser.cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="bg-slate-50 p-4 rounded-3xl flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-sm flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-slate-900 truncate text-sm">{item.name}</h5>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] font-black text-indigo-500 uppercase">{item.category}</span>
                          <span className="text-xs font-bold text-slate-600">x{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-20 text-slate-300 font-bold">No items found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
