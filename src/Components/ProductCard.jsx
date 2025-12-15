import React from 'react';
import { Link } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext'; // CRITICAL: For fitment check

// Placeholder for an Add to Cart icon
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.023.824l.737 4.582a1.5 1.5 0 001.405 1.01H18.75a1.5 1.5 0 001.405-1.01l.737-4.582c.068-.481.513-.824 1.023-.824h1.386v2.25H2.25v-2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25H12a2.25 2.25 0 012.25 2.25v2.25h2.25a2.25 2.25 0 012.25 2.25v2.25h1.125a2.25 2.25 0 002.25-2.25v-2.25a2.25 2.25 0 00-2.25-2.25h-1.125v-2.25a2.25 2.25 0 00-2.25-2.25H11.25z" />
    </svg>
);

const ProductCard = ({ product }) => {
    // 1. Check Vehicle Context
    const { selectedVehicle } = useVehicle();

    // 2. Logic: Assume a product object has a `fitmentStatus` property, 
    //      or you can determine it here based on a simplified check.
    // NOTE: This check depends on the actual structure of your product data.
    const isFit = selectedVehicle && product.compatible_vehicles?.includes(selectedVehicle.vehicleId); 
    const fitmentText = selectedVehicle 
        ? (isFit ? 'Fits Your Vehicle' : 'Does NOT Fit')
        : 'Select Vehicle for Fitment';
    
    const fitmentColor = selectedVehicle 
        ? (isFit ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200')
        : 'text-gray-500 border-gray-200';

    return (
        <div className="bg-white group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            
            {/* Image and Discount Tag */}
            <div className="relative h-48 overflow-hidden">
                
                {/* *** CRITICAL FIX: Ensure this is the singular /product/ *** */}
                <Link to={`/product/${product.id}`}>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
                {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{product.discount}%
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col justify-between h-40">
                {/* Fitment Status (The most important e-commerce addition) */}
                <div className={`text-xs font-semibold py-1 px-2 rounded border ${fitmentColor} mb-2`}>
                    {fitmentText}
                </div>
                
                {/* Product Info */}
                <div>
                    {/* *** CRITICAL FIX: Ensure this is the singular /product/ *** */}
                    <Link to={`/product/${product.id}`} className="block text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors line-clamp-2">
                        {product.name}
                    </Link>
                    <div className="text-xs text-yellow-500 my-1">
                        {/* Star Rating Placeholder */}
                        {'★'.repeat(Math.round(product.rating))}
                        <span className="text-gray-400"> ({product.reviews})</span>
                    </div>
                </div>

                {/* Price and Action */}
                <div className="flex justify-between items-center mt-2">
                    <div>
                        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        {product.oldPrice && (
                            <span className="text-xs text-gray-500 line-through ml-2">${product.oldPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <button 
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-md flex items-center"
                        title="Add to Cart"
                        // Optional: Disable button if fitment fails?
                        disabled={selectedVehicle && !isFit} 
                    >
                        <CartIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;