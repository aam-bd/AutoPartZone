import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Products</div>
            <div className="stat-value text-primary">{overview.totalProducts}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-secondary">{overview.totalUsers}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Orders</div>
            <div className="stat-value text-accent">{overview.totalOrders}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.3 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
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
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
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

      {activeTab === 'orders' && (
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

      {activeTab === 'products' && charts.topSellingProducts && (
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

      {activeTab === 'activity' && charts.recentActivity && (
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