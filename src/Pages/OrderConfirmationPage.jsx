// --- src/Pages/OrderConfirmationPage.jsx ---
import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50">
            <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order details and confirmation have been sent to your email.
                </p>
                <div className="space-y-3">
                    <Link 
                        to="/" 
                        className="block w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                    <Link 
                        to="/account" 
                        className="block w-full px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        View Order History
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;