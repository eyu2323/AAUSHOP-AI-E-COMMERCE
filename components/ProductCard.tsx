
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAiRecommended?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isAiRecommended }) => {
  const currencySymbol = product.currency === 'ETB' ? 'ብር ' : '$';
  const currencyPosition = product.currency === 'ETB' ? 'before' : 'before';

  return (
    <div className={`group relative bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 animate-fade-in ${isAiRecommended ? 'ring-2 ring-indigo-500 ring-offset-4' : ''}`}>
      {isAiRecommended && (
        <div className="absolute top-4 left-4 z-10 bg-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg">
          AI Choice
        </div>
      )}
      
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <span className="text-indigo-600 font-bold">
            {product.currency === 'ETB' ? `${product.price.toLocaleString()} ${product.currency}` : `$${product.price.toFixed(2)}`}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold transform transition-all active:scale-95 hover:bg-indigo-600 shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
