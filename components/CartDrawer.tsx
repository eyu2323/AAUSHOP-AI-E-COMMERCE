
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  // Simple grouping by currency for display totals
  const currencyTotals = items.reduce((acc, item) => {
    acc[item.currency] = (acc[item.currency] || 0) + (item.price * item.quantity);
    return acc;
  }, {} as Record<string, number>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform animate-fade-in translate-x-0">
          <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-8">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="mt-4 text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-semibold text-gray-900">
                            <h3 className="line-clamp-1">{item.name}</h3>
                            <p className="ml-4">
                              {item.currency === 'ETB' ? `${(item.price * item.quantity).toLocaleString()} ብር` : `$${(item.price * item.quantity).toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center gap-3 border rounded-lg px-2 py-1">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="text-gray-500 hover:text-indigo-600 disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="font-medium text-gray-900 w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="text-gray-500 hover:text-indigo-600"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex">
                            <button 
                              type="button" 
                              onClick={() => onRemove(item.id)}
                              className="font-medium text-red-500 hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 py-6 px-4 sm:px-6 bg-gray-50">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Subtotals</p>
              {Object.entries(currencyTotals).map(([currency, total]) => (
                <div key={currency} className="flex justify-between text-lg font-bold text-gray-900">
                  <p>{currency}</p>
                  <p>{currency === 'ETB' ? `${total.toLocaleString()} ብር` : `$${total.toFixed(2)}`}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <button
                className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
