
import React from 'react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSearch: (query: string) => void;
  onOpenVisualSearch: () => void;
  searchQuery: string;
  isOnline?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  onSearch, 
  searchQuery, 
  onOpenVisualSearch,
  isOnline = false
}) => {
  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block leading-none">
                Aau<span className="text-indigo-600">Shop</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1 hidden sm:flex">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative group flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Ask our AI to find anything..."
                className="w-full bg-gray-100 border-none rounded-full py-2 px-6 pr-20 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
              <div className="absolute right-3 flex items-center gap-2">
                <button 
                  onClick={onOpenVisualSearch}
                  title="Search by Image"
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-full transition-all shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <div className="text-gray-300">|</div>
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 hidden sm:block"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
