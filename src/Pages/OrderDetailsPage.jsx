import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../services/orderService';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                console.log('🔍 Fetching order details for:', orderId);
                console.log('🔢 orderId type:', typeof orderId);
                console.log('🔢 orderId length:', orderId ? orderId.length : 'undefined');
                
                const orderData = await orderService.getOrderById(orderId);
                console.log('📋 Order data received:', orderData);
                setOrder(orderData.order || orderData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Order not found');
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        } else {
            setError('No order ID provided');
            setLoading(false);
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50">
                <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-2xl w-full">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/orders" className="btn btn-primary">
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Link to="/orders" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                    ← Back to Orders
                </Link>
                <h1 className="text-3xl font-bold">Order Details</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-semibold">#{order.orderNumber || (order._id ? order._id.slice(-8).toUpperCase() : 'N/A')}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Order Status</p>
                        <span className={`badge badge-${order.status === 'pending' ? 'warning' : order.status === 'delivered' ? 'success' : 'info'}`}>
                            {order.status || 'Processing'}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-semibold">৳{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-semibold capitalize">{order.paymentMethod?.type || order.paymentMethod || 'Card'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-semibold">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <span className={`badge badge-${order.paymentMethod?.status === 'completed' ? 'success' : 'warning'}`}>
                            {order.paymentMethod?.status || 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <p className="text-gray-700">
                            {order.shippingAddress.fullName}<br />
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                            {order.shippingAddress.country}<br />
                            {order.shippingAddress.email}<br />
                            {order.shippingAddress.phone}
                        </p>
                    </div>
                )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold mb-4">Order Items</h3>
                {order.items && order.items.length > 0 ? (
                    <div className="space-y-3">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center border-b pb-3">
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">৳{item.price.toFixed(2)} each</p>
                                </div>
                            </div>
                        ))}
                        
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal:</span>
                                <span>৳{order.subtotal ? order.subtotal.toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Tax:</span>
                                <span>৳{order.tax ? order.tax.toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Shipping:</span>
                                <span>৳{order.shippingCost ? order.shippingCost.toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>৳{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">No items found in this order.</p>
                )}
            </div>

            <div className="flex space-x-4">
                <Link to="/orders" className="btn btn-outline">
                    Back to Orders
                </Link>
                <Link to="/shop" className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderDetailsPage;