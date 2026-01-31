import React from 'react';

interface ProductCardProps {
  name: string;
  category: string;
  price: number;
  imageUrl: string; // Placeholder for the actual image path
}

const ProductCard: React.FC<ProductCardProps> = ({ name, category, price, imageUrl }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      
      {/* Product Image Section */}
      <div className="flex items-center justify-center h-48 mb-4 bg-gray-50 rounded-lg overflow-hidden">
        {/* Replace this with an actual <img /> tag */}
        <div className="text-gray-400 text-sm">
            
        </div>
      </div>

      {/* Product Info */}
      <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-1">
        {category}
      </p>
      <h3 className="text-xl font-semibold text-gray-900 truncate mb-3">
        {name}
      </h3>
      
      {/* Price and Action */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold text-gray-800">
          ${price.toFixed(2)}
        </span>
        <button
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full 
                     hover:bg-blue-700 transition-colors shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;