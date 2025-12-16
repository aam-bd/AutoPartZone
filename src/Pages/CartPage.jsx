// --- src/Pages/CartPage.jsx ---
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useVehicle } from '../context/VehicleContext';

// --- Icons (Placeholders) ---
const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9L15.37 20.25a2 2 0 01-2 2H10.63a2 2 0 01-2-2L9.26 9M6 6h12M6 6L7.5 19.5M16.5 19.5L18 6" />
    </svg>
);
const TruckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18L12 10.5V18l-3.75 3.75M8.25 18l3.75-7.5M12 10.5V2.25M12 10.5h4.5M12 2.25h4.5M16.5 2.25V18" />
    </svg>
);

// --- Component: Individual Cart Item Row ---
const CartItem = ({ item }) => {
    const { updateCartQuantity, removeFromCart } = useCart();

    return (
        <div className="flex items-center justify-between py-4 border-b">
            
            {/* Product Info */}
            <div className="flex items-center space-x-4 w-1/2">
                {/* Image Placeholder (replace with actual image) */}
                <img src={item.image || '/assets/default-part.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                
                <div>
                    <Link to={`/product/${item.id}`} className="font-bold text-gray-800 hover:text-red-600 transition-colors">
                        {item.name}
                    </Link>
                    <p className="text-sm text-gray-500">Brand: {item.brand || 'Generic'}</p>
                </div>
            </div>

            {/* Quantity Controls */}
            <div className="w-1/6 text-center">
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 p-2 border rounded-lg text-center focus:ring-red-500"
                />
            </div>
            
            {/* Price */}
            <div className="w-1/6 text-right">
                <span className="font-semibold text-gray-800">${item.price.toFixed(2)}</span>
            </div>
            
            {/* Total Price for Item */}
            <div className="w-1/6 text-right">
                <span className="font-bold text-red-600">${(item.price * item.quantity).toFixed(2)}</span>
            </div>

            {/* Remove Button */}
            <div className="w-auto ml-4">
                <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove item"
                >
                    <RemoveIcon />
                </button>
            </div>
        </div>
    );
};

// --- Main Component: CartPage ---
const CartPage = () => {
    // Get state from contexts
    const { cartItems, totalPrice, cartCount, addToCart } = useCart();
    const { selectedVehicle } = useVehicle();

    const shippingCost = totalPrice >= 140 ? 0 : 15.00; // Free shipping over $140
    const grandTotal = totalPrice + shippingCost;

    if (cartCount === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Your Cart is Empty</h1>
                <p className="text-lg text-gray-600 mb-8">Start shopping to find perfect parts for your vehicle.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-red-700 transition-colors">
                        Start Shopping
                    </Link>
                    <button 
                        onClick={() => {
                            // Add some demo products
                            const demoProducts = [
                                { _id: '1', name: 'Car Side View Mirror', price: 120, image: '/assets/default-part.jpg' },
                                { _id: '2', name: 'Car Brake Pads', price: 85, image: '/assets/default-part.jpg' }
                            ];
                            demoProducts.forEach(product => addToCart(product, 1));
                        }}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-blue-700 transition-colors"
                    >
                        Add Demo Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-red-600 pb-2">
                Your Shopping Cart ({cartCount} Items)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Left Column: Cart Items List */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-xl">
                    
                    {/* Header Row */}
                    <div className="flex justify-between font-bold text-gray-600 py-2 border-b-2">
                        <span className="w-1/2">Product</span>
                        <span className="w-1/6 text-center">Qty</span>
                        <span className="w-1/6 text-right">Price</span>
                        <span className="w-1/6 text-right">Subtotal</span>
                        <span className="w-auto ml-4"></span>
                    </div>

                    {/* Item List */}
                    {cartItems.map(item => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>

                {/* 2. Right Column: Summary and Checkout */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Vehicle Fitment Status (Reiterated for safety) */}
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-md">
                        <h3 className="font-bold text-red-700 mb-2 flex items-center">
                            <TruckIcon /> Fitment Check
                        </h3>
                        {selectedVehicle ? (
                            <p className="text-sm text-gray-700">
                                Currently shopping for: <span className="font-semibold">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</span>. All items checked for fitment.
                            </p>
                        ) : (
                            <p className="text-sm text-red-700 font-semibold">
                                Vehicle not selected. Please select your vehicle on the homepage to guarantee fitment.
                            </p>
                        )}
                    </div>
                    
                    {/* Cart Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-red-600">
                        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                        
                        <div className="space-y-2 text-gray-700">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                        
                        <div className="border-t pt-4 mt-4 flex justify-between text-2xl font-extrabold text-gray-900">
                            <span>Grand Total:</span>
                            <span>${grandTotal.toFixed(2)}</span>
                        </div>
                        
                        {/* Checkout Button */}
                        <Link to="/checkout" className="mt-6 block w-full bg-red-600 text-white text-center py-3 rounded-full font-bold uppercase hover:bg-red-700 transition-colors shadow-lg">
                            Proceed to Checkout
                        </Link>
                        
                        {/* Continue Shopping */}
                        <Link to="/" className="mt-3 block w-full text-center text-sm text-gray-500 hover:text-red-600 underline">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CartPage;