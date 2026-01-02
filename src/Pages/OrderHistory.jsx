import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService.jsx';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders(filters);
      setOrders(response.orders || response.data?.orders || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 })
    }));
  };

  const handleOrderClick = async (orderId) => {
    try {
      const orderDetails = await orderService.getOrderById(orderId);
      setSelectedOrder(orderDetails);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      await orderService.cancelOrder(orderId, reason);
      fetchOrders(); // Refresh orders
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.message);
    }
  };

  const handleReorder = async (orderId) => {
    try {
      await orderService.reorderItems(orderId);
      // Navigate to cart page
      window.location.href = '/cart';
    } catch (err) {
      console.error('Error reordering:', err);
      setError(err.message);
    }
  };

  const OrderCard = ({ order }) => {
    const statusConfig = orderService.formatStatus(order.status);
    const totals = orderService.calculateOrderTotals(order);

return (
      <div className="card bg-base-100 shadow-lg cursor-pointer hover:shadow-xl transition-shadow p-6"
           onClick={() => handleOrderClick(order._id)}>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h3 className="font-semibold text-lg">Order #{order.orderNumber || order._id?.slice(-8)}</h3>
              <span className={`badge badge-${statusConfig.color} badge-sm`}>
                {statusConfig.text}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Order Date: {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8-4m8-4l8 4m-8 4v6l8 2m-8-2l-8 2" />
                </svg>
                <span>Items: {order.items?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 .895 3 2-1.343 2-3-2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v2m0-4c0 1.11-.89 2-2 2a2 2 0 002-2 2 2-.89 2-2 2-2-.89-2-2z" />
                </svg>
                <span>Total: ৳{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center pl-6">
            <div className="text-lg font-bold text-primary mb-2">
              ৳{totals.total.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <span>View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderModal = () => {
    if (!selectedOrder) return null;
    
    const statusConfig = orderService.formatStatus(selectedOrder.status);
    const totals = orderService.calculateOrderTotals(selectedOrder);

    return (
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Order #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}
            </h2>
            <button 
              className="btn btn-circle btn-ghost"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>
          </div>

          {/* Order Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Status</div>
              <div className={`stat-value text-${statusConfig.color}`}>
                {statusConfig.text}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Order Date</div>
              <div className="stat-value text-sm">
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </div>
            </div>
            {selectedOrder.estimatedDelivery && (
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Est. Delivery</div>
                <div className="stat-value text-sm">
                  {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          {item.productId?.brand && (
                            <div className="text-sm text-gray-500">
                              Brand: {item.productId.brand}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>৳{item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td className="font-semibold">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>৳{totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>৳{totals.shipping.toFixed(2)}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>৳{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {selectedOrder.shippingAddress && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="bg-base-200 p-4 rounded-lg">
                <div>{selectedOrder.shippingAddress.street}</div>
                <div>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                </div>
                <div>{selectedOrder.shippingAddress.country}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            {selectedOrder.status === 'processing' && (
              <button 
                className="btn btn-error"
                onClick={() => handleCancelOrder(selectedOrder._id)}
              >
                Cancel Order
              </button>
            )}
            {(selectedOrder.status === 'delivered' || selectedOrder.status === 'completed') && (
              <button 
                className="btn btn-primary"
                onClick={() => handleReorder(selectedOrder._id)}
              >
                Reorder Items
              </button>
            )}
            <button 
              className="btn btn-ghost"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="alert alert-error">
          <span>Error loading orders: {error}</span>
          <button className="btn btn-sm btn-ghost ml-4" onClick={fetchOrders}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {/* Filters */}
      <div className="card bg-base-100 p-6 mb-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status Filter</label>
            <select
              className="select select-bordered w-full"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button
              className="btn btn-outline"
              onClick={() => setFilters({ status: '', page: 1, limit: 10 })}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-4">
          {pagination.total} orders found
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-4 mb-8">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-gray-600 mb-4">
            {filters.status || filters.startDate || filters.endDate 
              ? 'Try adjusting your filters' 
              : 'You haven\'t placed any orders yet'}
          </p>
          {(!filters.status && !filters.startDate && !filters.endDate) && (
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/shop'}
            >
              Start Shopping
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center">
          <div className="btn-group">
            <button
              className="btn"
              disabled={pagination.current === 1}
              onClick={() => handleFilterChange('page', pagination.current - 1)}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`btn ${page === pagination.current ? 'btn-active' : ''}`}
                  onClick={() => handleFilterChange('page', page)}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              className="btn"
              disabled={pagination.current === pagination.pages}
              onClick={() => handleFilterChange('page', pagination.current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderModal />
    </div>
  );
};

export default OrderHistory;