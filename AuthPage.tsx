
import React, { useState } from 'react';
import { User as AppUser, CartItem } from './types';
import { apiService } from './services/apiService';

interface AuthPageProps {
  onLogin: (userData: AppUser) => void;
  onClose: () => void;
  guestCart: CartItem[];
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onClose, guestCart }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let loggedInUser: AppUser;
      if (isLogin) {
        loggedInUser = await apiService.login(formData.email, formData.password);
      } else {
        loggedInUser = await apiService.register(formData.username, formData.email, formData.password, guestCart);
      }
      
      localStorage.setItem('aaushop_user', JSON.stringify(loggedInUser));
      onLogin(loggedInUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 animate-fade-in border border-white/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-2xl shadow-indigo-200">
            A
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            {isLogin ? 'Access your AauShop Profile' : 'Join the future of retail'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Display Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-50 border-gray-100 border-2 rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
                placeholder="Abebe Bikila"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border-gray-100 border-2 rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
              placeholder="name@aau.edu.et"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-50 border-gray-100 border-2 rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-4.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 mt-4 active:scale-95"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              isLogin ? 'Authenticate' : 'Initialize Account'
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-gray-100 pt-8">
          <p className="text-gray-500 text-sm font-medium">
            {isLogin ? "New to the platform?" : "Already part of the database?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-black hover:underline ml-1"
            >
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
