import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
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

// Analytics Section
const AnalyticsSection = ({ token }) => {
  const [activeReport, setActiveReport] = useState('sales');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    period: 'monthly'
  });

  useEffect(() => {
    fetchReportData();
  }, [activeReport, filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        period: filters.period,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      let endpoint;
      switch (activeReport) {
        case 'sales':
          endpoint = `/api/analytics/sales?${queryParams}`;
          break;
        case 'inventory':
          endpoint = `/api/analytics/inventory`;
          break;
        case 'customers':
          endpoint = `/api/analytics/users`;
          break;
        default:
          endpoint = `/api/analytics/sales?${queryParams}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();
      setReportData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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

  return (
    <div className="space-y-6">
      {/* Report Type Tabs */}
      <div className="tabs tabs-boxed">
        {['sales', 'inventory', 'customers'].map((type) => (
          <button
            key={type}
            className={`tab capitalize ${activeReport === type ? 'tab-active' : ''}`}
            onClick={() => setActiveReport(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Period</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.period}
                onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {activeReport === 'sales' && <SalesAnalytics data={reportData} />}
      {activeReport === 'inventory' && <InventoryAnalytics data={reportData} />}
      {activeReport === 'customers' && <CustomerAnalytics data={reportData} />}
    </div>
  );
};

const SalesAnalytics = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {data.salesData && data.salesData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat bg-primary text-primary-content rounded-lg">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value">৳{data.salesData.reduce((sum, item) => sum + (item.totalRevenue || 0), 0).toFixed(2)}</div>
          </div>
          <div className="stat bg-secondary text-secondary-content rounded-lg">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{data.salesData.reduce((sum, item) => sum + (item.totalOrders || 0), 0)}</div>
          </div>
          <div className="stat bg-accent text-accent-content rounded-lg">
            <div className="stat-title">Total Items</div>
            <div className="stat-value">{data.salesData.reduce((sum, item) => sum + (item.totalItems || 0), 0)}</div>
          </div>
          <div className="stat bg-info text-info-content rounded-lg">
            <div className="stat-title">Avg Order Value</div>
            <div className="stat-value">
              ৳{(data.salesData.reduce((sum, item) => sum + (item.totalRevenue || 0), 0) / 
                  data.salesData.reduce((sum, item) => sum + (item.totalOrders || 0), 0) || 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        {data.salesData && data.salesData.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Sales Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" name="Revenue" />
                  <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category Revenue */}
        {data.revenueByCategory && data.revenueByCategory.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Revenue by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.revenueByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                    label={({ _id, revenue }) => `${_id}: ৳${revenue.toFixed(0)}`}
                  >
                    {data.revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InventoryAnalytics = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {data.overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat bg-primary text-primary-content rounded-lg">
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{data.overview.totalProducts}</div>
          </div>
          <div className="stat bg-secondary text-secondary-content rounded-lg">
            <div className="stat-title">Stock Value</div>
            <div className="stat-value">৳{data.overview.totalStockValue.toFixed(2)}</div>
          </div>
          <div className="stat bg-warning text-warning-content rounded-lg">
            <div className="stat-title">Low Stock</div>
            <div className="stat-value">{data.overview.lowStockItems}</div>
          </div>
          <div className="stat bg-error text-error-content rounded-lg">
            <div className="stat-title">Out of Stock</div>
            <div className="stat-value">{data.overview.outOfStockItems}</div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {data.categoryInventory && data.categoryInventory.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Category Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Products</th>
                    <th>Total Stock</th>
                    <th>Stock Value</th>
                    <th>Low Stock Items</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categoryInventory.map((category, index) => (
                    <tr key={index}>
                      <td className="font-semibold">{category._id}</td>
                      <td>{category.totalProducts}</td>
                      <td>{category.totalStock}</td>
                      <td>৳{category.stockValue.toFixed(2)}</td>
                      <td className={category.lowStockCount > 0 ? 'text-warning font-semibold' : ''}>
                        {category.lowStockCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Products */}
      {data.lowStockProducts && data.lowStockProducts.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Low Stock Products</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Current Stock</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lowStockProducts.slice(0, 10).map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td className="text-warning font-semibold">{product.stock}</td>
                      <td>৳{product.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerAnalytics = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {data.overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat bg-primary text-primary-content rounded-lg">
            <div className="stat-title">Total Customers</div>
            <div className="stat-value">{data.overview.totalUsers}</div>
          </div>
          <div className="stat bg-secondary text-secondary-content rounded-lg">
            <div className="stat-title">Active Users</div>
            <div className="stat-value">{data.overview.activeUsers}</div>
          </div>
          <div className="stat bg-accent text-accent-content rounded-lg">
            <div className="stat-title">New This Month</div>
            <div className="stat-value">{data.overview.newUsersThisMonth}</div>
          </div>
        </div>
      )}

      {/* Top Customers Table */}
      {data.customerOrderStats && data.customerOrderStats.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Top Customers</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total Orders</th>
                    <th>Total Spent</th>
                    <th>Avg Order Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.customerOrderStats.slice(0, 10).map((customer, index) => (
                    <tr key={index}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.totalOrders}</td>
                      <td>৳{customer.totalSpent.toFixed(2)}</td>
                      <td>৳{customer.averageOrderValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Roles */}
      {data.overview.userRoles && data.overview.userRoles.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">User Roles</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.overview.userRoles.map((role, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold">{role.count}</div>
                  <div className="text-sm opacity-70 capitalize">{role._id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Orders Management Section
const OrdersSection = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : (data.orders || []));
      if (data.pagination) {
        setPagination(data.pagination);
      }
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
      
      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span className="px-4">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={currentPage >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};



const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

   useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, token, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
        return;
      }

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
            {sidebarItems.map((item) => {
              const isActive = item.route 
                ? location.pathname === item.route 
                : activeSection === item.id;
              
              return (
                <Link
                  key={item.id}
                  to={item.route || '/admin'}
                  onClick={() => !item.route && setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
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
                {location.pathname === '/admin' 
                  ? sidebarItems.find(item => item.id === activeSection)?.label
                  : sidebarItems.find(item => item.route === location.pathname)?.label || 'Admin Panel'
                }
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
            {location.pathname === '/admin' && activeSection === 'overview' && (
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
                        ৳{overview.monthlyRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Weekly Revenue</h2>
                      <div className="text-3xl font-bold text-secondary">
                        ৳{overview.weeklyRevenue.toLocaleString()}
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
                                <td>৳{order.totalAmount.toFixed(2)}</td>
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

                {location.pathname === '/admin' && activeSection === 'products' && charts.topSellingProducts && (
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
                                <td>৳{product.totalRevenue.toFixed(2)}</td>
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
                               <div className={`w-3 h-3 rounded-full ${getActivityColor(activity.newStock > activity.oldStock ? 'stock in' : 'stock out')}`}></div>
                             </div>
                             <div className="flex-1">
                               <p className="font-semibold">
                                 {activity.staffId?.name || 'System'} - Stock Change
                               </p>
                               <p className="text-sm opacity-70">
                                 {activity.productId?.name || 'Unknown Product'}
                               </p>
                               <p className="text-xs opacity-60">
                                 {activity.oldStock} → {activity.newStock}
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

            {location.pathname === '/admin' && activeSection === 'orders' && (
              <OrdersSection token={token} />
            )}



            {location.pathname === '/admin' && activeSection === 'analytics' && (
              <AnalyticsSection token={token} />
            )}
            
            {/* Render nested routes here */}
            <Outlet />
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