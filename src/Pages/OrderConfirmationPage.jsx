// --- src/Pages/OrderConfirmationPage.jsx ---
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';

const OrderConfirmationPage = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const orderId = localStorage.getItem('lastOrderId');
        const storedOrder = localStorage.getItem('lastOrder');
        
        if (orderId) {
            if (storedOrder) {
                // Use stored order data if API call fails
                try {
                    const orderData = JSON.parse(storedOrder);
                    setOrder(orderData);
                    setLoading(false);
                } catch (parseError) {
                    console.error('Error parsing stored order:', parseError);
                    fetchOrderDetails(orderId);
                }
            } else {
                fetchOrderDetails(orderId);
            }
            // Clear the stored order ID after using it
            localStorage.removeItem('lastOrderId');
            localStorage.removeItem('lastOrder');
        } else {
            setError('No order information found');
            setLoading(false);
        }
    }, []);

    const fetchOrderDetails = async (orderId) => {
        try {
            const orderData = await orderService.getOrderById(orderId);
            setOrder(orderData.order || orderData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching order:', err);
            console.log('API failed, but showing confirmation anyway');
            // Don't set error - order was placed successfully even if API fails
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50">
                <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        {error || 'We couldn\'t find your order details.'}
                    </p>
                    <div className="space-y-3">
                        <Link 
                            to="/" 
                            className="block w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50">
            <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-2xl w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order details and confirmation have been sent to your email.
                </p>
                
                {/* Order Details */}
                <div className="text-left mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-semibold">#{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Order Status</p>
                                <span className="badge badge-success">{order.status || 'Processing'}</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-semibold">${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Method</p>
                                <p className="font-semibold capitalize">{order.paymentMethod?.type || 'Card'}</p>
                            </div>
                        </div>
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-2">Order Summary</p>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm mb-2">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="space-y-3">
                    <Link 
                        to="/orders" 
                        className="block w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                        View Order Details
                    </Link>
                    <Link 
                        to="/" 
                        className="block w-full px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;