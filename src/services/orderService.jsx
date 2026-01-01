// API service for order operations
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class OrderService {
  // Get user's orders
  async getUserOrders(params = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || '',
      startDate: params.startDate || '',
      endDate: params.endDate || ''
    });

    const response = await fetch(`${API_BASE_URL}/orders/user?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return await response.json();
  }

  // Get single order by ID
  async getOrderById(orderId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Order not found');
    }
    return await response.json();
  }

  // Create new order
  async createOrder(orderData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    return await response.json();
  }

  // Cancel order
  async cancelOrder(orderId, reason) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      throw new Error('Failed to cancel order');
    }
    return await response.json();
  }

  // Request return/refund
  async requestReturn(orderId, items, reason) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/return`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items, reason })
    });

    if (!response.ok) {
      throw new Error('Failed to request return');
    }
    return await response.json();
  }

  // Get order tracking information
  async getOrderTracking(orderId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/tracking`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tracking information');
    }
    return await response.json();
  }

  // Reorder items from previous order
  async reorderItems(orderId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/reorder`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to reorder items');
    }
    return await response.json();
  }

  // Get order statistics for user
  async getUserOrderStats() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/orders/user/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order statistics');
    }
    return await response.json();
  }

  // Helper method to format order status
  formatStatus(status) {
    const statusConfig = {
      'processing': { text: 'Processing', color: 'warning' },
      'shipped': { text: 'Shipped', color: 'info' },
      'delivered': { text: 'Delivered', color: 'success' },
      'cancelled': { text: 'Cancelled', color: 'error' },
      'refunded': { text: 'Refunded', color: 'error' }
    };
    
    return statusConfig[status] || { text: status, color: 'gray' };
  }

  // Helper method to calculate order totals
  calculateOrderTotals(order) {
    const subtotal = order.items?.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0) || order.subtotal || 0;

    const tax = order.tax || (subtotal * 0.05);
    const shipping = order.shippingCost || 10;
    const total = order.totalAmount || (subtotal + tax + shipping);

    return { subtotal, tax, shipping, total };
  }
}

export default new OrderService();