import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  BarChart3,
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  LogOut
} from 'lucide-react';

// Orders Management Section
const OrdersSection = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      fetchOrders(); // Refresh orders
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Management</h3>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-8)}</td>
                <td>{order.userId?.name || 'N/A'}</td>
                <td>{order.userId?.email || 'N/A'}</td>
                <td>৳{(order.totalAmount || order.total || 0).toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    className="select select-xs select-bordered"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center py-8 text-gray-500">No orders found</p>
        )}
      </div>
    </div>
  );
};



const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, token, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const quickActions = [
    { 
      label: 'Manage Products', 
      icon: Plus, 
      action: () => navigate('/admin/products'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    { 
      label: 'View All Orders', 
      icon: Eye, 
      action: () => setActiveSection('orders'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },

    { 
      label: 'Generate Reports', 
      icon: BarChart3, 
      action: () => setActiveSection('analytics'),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, route: '/admin/products' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users, route: '/admin/users' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const { overview, charts } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">AutoPartZone</p>
          </div>
          
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.route ? navigate(item.route) : setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-gray-400 text-sm">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="mt-4 w-full flex items-center space-x-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-8 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {sidebarItems.find(item => item.id === activeSection)?.label}
              </h2>
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                View Store
              </button>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-8">
            {activeSection === 'overview' && (
              <div>
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`${action.color} text-white px-4 py-3 rounded-lg flex flex-col items-center space-y-2 transition-colors`}
                      >
                        <action.icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-figure text-primary">
                        <Package className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Total Products</div>
                      <div className="stat-value text-primary">{overview.totalProducts}</div>
                    </div>
                  </div>

                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-figure text-secondary">
                        <Users className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Total Users</div>
                      <div className="stat-value text-secondary">{overview.totalUsers}</div>
                    </div>
                  </div>

                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-figure text-accent">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Total Orders</div>
                      <div className="stat-value text-accent">{overview.totalOrders}</div>
                    </div>
                  </div>

                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-figure text-warning">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Low Stock Items</div>
                      <div className="stat-value text-warning">{overview.lowStockProducts}</div>
                    </div>
                  </div>
                </div>

                {/* Revenue Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Monthly Revenue</h2>
                      <div className="text-3xl font-bold text-primary">
                        ${overview.monthlyRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Weekly Revenue</h2>
                      <div className="text-3xl font-bold text-secondary">
                        ${overview.weeklyRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="tabs tabs-boxed mb-8">
                  <button 
                    className={`tab ${activeSection === 'overview' ? 'tab-active' : ''}`}
                    onClick={() => setActiveSection('overview')}
                  >
                    Overview
                  </button>
                  <button 
                    className={`tab ${activeSection === 'orders' ? 'tab-active' : ''}`}
                    onClick={() => setActiveSection('orders')}
                  >
                    Orders
                  </button>
                  <button 
                    className={`tab ${activeSection === 'products' ? 'tab-active' : ''}`}
                    onClick={() => setActiveSection('products')}
                  >
                    Products
                  </button>
                  <button 
                    className={`tab ${activeSection === 'activity' ? 'tab-active' : ''}`}
                    onClick={() => setActiveSection('activity')}
                  >
                    Activity
                  </button>
                </div>

                {/* Tab Content */}
                {activeSection === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Status Pie Chart */}
                    {charts.orderStatusBreakdown && (
                      <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title">Order Status Breakdown</h2>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={charts.orderStatusBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ _id, count }) => `${_id}: ${count}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {charts.orderStatusBreakdown.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Top Selling Products Bar Chart */}
                    {charts.topSellingProducts && (
                      <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title">Top Selling Products</h2>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={charts.topSellingProducts}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="totalQuantity" fill="#8884d8" name="Quantity Sold" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'orders' && (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Recent Orders</h2>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Customer</th>
                              <th>Email</th>
                              <th>Total</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {charts.recentOrders?.map((order) => (
                              <tr key={order._id}>
                                <td>{order._id.slice(-8)}</td>
                                <td>{order.userId?.name || 'N/A'}</td>
                                <td>{order.userId?.email || 'N/A'}</td>
                                <td>${order.totalAmount.toFixed(2)}</td>
                                <td>
                                  <span className={`badge badge-${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'products' && charts.topSellingProducts && (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Product Performance</h2>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr>
                              <th>Product Name</th>
                              <th>Total Sold</th>
                              <th>Revenue</th>
                              <th>Current Stock</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {charts.topSellingProducts.map((product, index) => (
                              <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.totalQuantity}</td>
                                <td>${product.totalRevenue.toFixed(2)}</td>
                                <td>
                                  <span className={`font-semibold ${product.currentStock < 10 ? 'text-warning' : 'text-success'}`}>
                                    {product.currentStock}
                                  </span>
                                </td>
                                <td>
                                  {product.currentStock < 10 ? (
                                    <span className="badge badge-warning">Low Stock</span>
                                  ) : (
                                    <span className="badge badge-success">In Stock</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'activity' && charts.recentActivity && (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Recent Activity</h2>
                      <div className="space-y-4">
                        {charts.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-base-200 rounded-lg">
                            <div className="flex-shrink-0">
                              <div className={`w-3 h-3 rounded-full ${getActivityColor(activity.type)}`}></div>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">
                                {activity.userId?.name || 'System'} - {activity.type}
                              </p>
                              <p className="text-sm opacity-70">
                                {activity.productId?.name || 'Unknown Product'}
                              </p>
                            </div>
                            <div className="text-sm opacity-60">
                              {new Date(activity.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'orders' && (
              <OrdersSection token={token} />
            )}



            {activeSection === 'analytics' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {sidebarItems.find(item => item.id === activeSection)?.label}
                </h3>
                <p className="text-gray-600">Advanced analytics section coming soon.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'success';
    case 'processing': return 'warning';
    case 'cancelled': return 'error';
    default: return 'ghost';
  }
};

const getActivityColor = (type) => {
  switch (type.toLowerCase()) {
    case 'stock in': return 'bg-success';
    case 'stock out': return 'bg-error';
    case 'adjustment': return 'bg-warning';
    default: return 'bg-info';
  }
};

export default AdminDashboard;