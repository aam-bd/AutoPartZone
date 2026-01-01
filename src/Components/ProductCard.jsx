import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext'; // CRITICAL: For fitment check
import { useCart } from '../context/CartContext';

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
    const { addToCart, isInCart, getItemQuantity } = useCart();
    
    // Image loading state to prevent flickering
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showQuantitySelector, setShowQuantitySelector] = useState(false);
    const [quantity, setQuantity] = useState(1);



    return (
        <div className="bg-white group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            
            {/* Image and Discount Tag */}
            <div className="relative h-48 overflow-hidden">
                
                {/* *** CRITICAL FIX: Ensure this is the singular /product/ *** */}
                <Link to={`/product/${product._id || product.id}`}>
                    <div className="relative w-full h-full">
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                        )}
                        <img 
                            src={imageError ? '/assets/default-part.jpg' : (
                                product.image 
                                    ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`)
                                    : (product.images?.[0] 
                                        ? (product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`)
                                        : '/assets/default-part.jpg')
                            )} 
                            alt={product.name} 
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.target.onerror = null;
                                setImageError(true);
                                e.target.src = '/assets/default-part.jpg';
                            }}
                        />
                    </div>
                </Link>
                {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{product.discount}%
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col justify-between h-40">
            {/* Stock/Ratings Info */}
                <div className={`text-xs font-semibold py-1 px-2 rounded border mb-2 ${
                    (product.stock || 0) > 10 
                        ? 'text-green-600 border-green-200 bg-green-50' 
                        : (product.stock || 0) > 0 
                            ? 'text-yellow-600 border-yellow-200 bg-yellow-50'
                            : 'text-red-600 border-red-200 bg-red-50'
                }`}>
                    {(product.stock || 0) > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                </div>
                
                {/* Product Info */}
                <div>
                    {/* *** CRITICAL FIX: Ensure this is the singular /product/ *** */}
                    <Link to={`/product/${product._id || product.id}`} className="block text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors line-clamp-2">
                        {product.name}
                    </Link>
                    <div className="text-xs text-yellow-500 my-1">
                        {/* Star Rating */}
                        {'★'.repeat(Math.round(product.rating || 0))}
                        <span className="text-gray-400"> ({product.reviews || 0})</span>
                    </div>
                </div>

                {/* Price and Action */}
                <div className="flex justify-between items-center mt-2">
                    <div>
                        <span className="text-lg font-bold text-gray-900">৳{product.price.toFixed(2)}</span>
                        {product.oldPrice && (
                            <span className="text-xs text-gray-500 line-through ml-2">৳{product.oldPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {showQuantitySelector ? (
                            <div className="flex items-center gap-1">
                                <button
                                    className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-xs font-bold"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setQuantity(Math.max(1, quantity - 1));
                                    }}
                                >
                                    -
                                </button>
                                <span className="text-sm font-semibold px-2">{quantity}</span>
                                <button
                                    className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-xs font-bold"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setQuantity(quantity + 1);
                                    }}
                                >
                                    +
                                </button>
                                <button
                                    className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-700"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        try {
                                            await addToCart(product, quantity);
                                            setShowQuantitySelector(false);
                                            setQuantity(1);
                                        } catch (error) {
                                            console.error('Add to cart error:', error);
                                        }
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    className="text-gray-500 hover:text-red-600 text-xs"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowQuantitySelector(false);
                                        setQuantity(1);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <>
                                {isInCart(product._id || product.id) ? (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-green-600 font-semibold">
                                            {getItemQuantity(product._id || product.id)} in cart
                                        </span>
                                        <Link 
                                            to="/cart" 
                                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View Cart
                                        </Link>
                                    </div>
                                ) : (
                                    <button 
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-700 transition-colors shadow-md"
                                        title="Add to Cart"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowQuantitySelector(true);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;