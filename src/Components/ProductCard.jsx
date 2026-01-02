import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext'; // CRITICAL: For fitment check
import { useCart } from '../context/CartContext';

// Add to Cart icon
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

// Quick Add icon
const QuickAddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
        <div className="glass-card group overflow-hidden rounded-xl">
            
            {/* Image and Discount Tag */}
            <div className="relative h-56 overflow-hidden bg-red-50">
                
                {/* *** CRITICAL FIX: Ensure this is the singular /product/ *** */}
                <Link to={`/product/${product._id || product.id}`}>
                    <div className="relative w-full h-full">
                        {!imageLoaded && !imageError && (
                            <div className="skeleton absolute inset-0"></div>
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
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.target.onerror = null;
                                setImageError(true);
                                e.target.src = '/assets/default-part.jpg';
                            }}
                        />
                        
                        {/* Quick Add Button - Appears on hover */}
                        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowQuantitySelector(true);
                                }}
                                className="bg-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                                title="Quick Add to Cart"
                            >
                                <QuickAddIcon />
                                Quick Add
                            </button>
                        </div>
                    </div>
                </Link>
                
                {/* Minimalist Discount Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-4 left-4">
                        <span className="badge-minimal">
                            {product.discount}% OFF
                        </span>
                    </div>
                )}
                
                {/* Stock Status Indicator */}
                <div className="absolute top-4 right-4">
                    <div className={`status-dot ${
                        (product.stock || 0) > 10 
                            ? 'in-stock' 
                            : (product.stock || 0) > 0 
                                ? 'low-stock'
                                : 'out-of-stock'
                    }`}></div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {/* Product Info */}
                <div>
                    {/* *** CRITICAL FIX: Ensure this is the singular /product/ *** */}
                    <Link 
                        to={`/product/${product._id || product.id}`} 
                        className="block text-lg font-semibold text-red-800 hover:text-red-600 transition-colors duration-300 line-clamp-2 leading-tight"
                    >
                        {product.name}
                    </Link>
                    
                    {/* Brand */}
                    {product.brand && (
                        <p className="text-sm text-red-600 mt-1">{product.brand}</p>
                    )}
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-red-800 tracking-tight">
                        ৳{product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                        <span className="text-sm text-red-400 line-through">
                            ৳{product.oldPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
                    (product.stock || 0) > 10 
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                        : (product.stock || 0) > 0 
                            ? 'text-amber-700 bg-amber-50 border border-amber-200'
                            : 'text-red-700 bg-red-50 border border-red-200'
                }`}>
                    {(product.stock || 0) > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </div>

                {/* Action Section */}
                <div className="flex items-center gap-2">
                    {showQuantitySelector ? (
                        <div className="flex items-center gap-2 w-full">
                            <div className="flex items-center bg-red-100 rounded-full overflow-hidden">
                                <button
                                    className="w-8 h-8 flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setQuantity(Math.max(1, quantity - 1));
                                    }}
                                >
                                    <span className="text-red-600 font-semibold text-sm">−</span>
                                </button>
                                <span className="text-sm font-semibold text-red-800 px-3 py-1">{quantity}</span>
                                <button
                                    className="w-8 h-8 flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setQuantity(quantity + 1);
                                    }}
                                >
                                    <span className="text-red-600 font-semibold text-sm">+</span>
                                </button>
                            </div>
                            <button
                                className="btn-premium text-sm px-4 py-2 flex-1 hover:scale-105 active:scale-95"
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
                                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowQuantitySelector(false);
                                    setQuantity(1);
                                }}
                            >
                                <span className="text-lg leading-none text-red-600">×</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {isInCart(product._id || product.id) ? (
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-sm font-medium text-red-600 flex items-center gap-2">
                                        <CartIcon />
                                        {getItemQuantity(product._id || product.id)} in cart
                                    </span>
                                    <Link 
                                        to="/cart" 
                                        className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View Cart
                                    </Link>
                                </div>
                            ) : (
                                <button 
                                    className="btn-premium text-sm w-full hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                    title="Add to Cart"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowQuantitySelector(true);
                                    }}
                                >
                                    <CartIcon />
                                    <span>Add to Cart</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;