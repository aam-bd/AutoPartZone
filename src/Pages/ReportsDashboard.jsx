import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsDashboard = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    format: 'json',
    period: 'monthly'
  });

  useEffect(() => {
    fetchReportData();
  }, [activeReport, filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const queryParams = new URLSearchParams({
        format: filters.format,
        period: filters.period,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const endpoint = `/api/reports/${activeReport}`;
      const response = await fetch(`${endpoint}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      if (filters.format === 'json') {
        const data = await response.json();
        setReportData(data.data);
      } else {
        // Handle file downloads
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeReport}-report.${filters.format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format) => {
    setFilters(prev => ({ ...prev, format }));
    setTimeout(() => fetchReportData(), 100);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading && filters.format === 'json') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error && filters.format === 'json') {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  // Render charts and data for JSON format
  if (filters.format === 'json' && reportData) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reports Dashboard</h1>
          
          <div className="flex gap-2">
            <button 
              className="btn btn-outline btn-primary"
              onClick={() => handleDownload('pdf')}
            >
              Download PDF
            </button>
            <button 
              className="btn btn-outline btn-secondary"
              onClick={() => handleDownload('csv')}
            >
              Download CSV
            </button>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="tabs tabs-boxed mb-6">
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
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Format</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.format}
                  onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value }))}
                >
                  <option value="json">JSON</option>
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        {activeReport === 'sales' && <SalesReport data={reportData} />}
        {activeReport === 'inventory' && <InventoryReport data={reportData} />}
        {activeReport === 'customers' && <CustomerReport data={reportData} />}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Generating report...</p>
      </div>
    </div>
  );
};

const SalesReport = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-primary text-primary-content rounded-lg">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">${data.summary.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat bg-secondary text-secondary-content rounded-lg">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">{data.summary.totalOrders}</div>
        </div>
        <div className="stat bg-accent text-accent-content rounded-lg">
          <div className="stat-title">Total Items</div>
          <div className="stat-value">{data.summary.totalItems}</div>
        </div>
        <div className="stat bg-info text-info-content rounded-lg">
          <div className="stat-title">Avg Order Value</div>
          <div className="stat-value">${data.summary.averageOrderValue.toFixed(2)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
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

        {/* Category Revenue */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Revenue by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryRevenue}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  label={({ _id, revenue }) => `${_id}: $${revenue.toFixed(0)}`}
                >
                  {data.categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Quantity Sold</th>
                  <th>Revenue</th>
                  <th>Current Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>{product.totalQuantity}</td>
                    <td>${product.totalRevenue.toFixed(2)}</td>
                    <td className={product.currentStock < 10 ? 'text-warning font-semibold' : ''}>
                      {product.currentStock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryReport = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-primary text-primary-content rounded-lg">
          <div className="stat-title">Total Products</div>
          <div className="stat-value">{data.summary.totalProducts}</div>
        </div>
        <div className="stat bg-secondary text-secondary-content rounded-lg">
          <div className="stat-title">Stock Value</div>
          <div className="stat-value">${data.summary.totalStockValue.toFixed(2)}</div>
        </div>
        <div className="stat bg-warning text-warning-content rounded-lg">
          <div className="stat-title">Low Stock</div>
          <div className="stat-value">{data.summary.lowStockProducts}</div>
        </div>
        <div className="stat bg-error text-error-content rounded-lg">
          <div className="stat-title">Out of Stock</div>
          <div className="stat-value">{data.summary.outOfStockProducts}</div>
        </div>
      </div>

      {/* Category Breakdown */}
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
                {data.categorySummary.map((category, index) => (
                  <tr key={index}>
                    <td className="font-semibold">{category._id}</td>
                    <td>{category.totalProducts}</td>
                    <td>{category.totalStock}</td>
                    <td>${category.totalValue.toFixed(2)}</td>
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
    </div>
  );
};

const CustomerReport = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-primary text-primary-content rounded-lg">
          <div className="stat-title">Total Customers</div>
          <div className="stat-value">{data.summary.totalCustomers}</div>
        </div>
        <div className="stat bg-secondary text-secondary-content rounded-lg">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">${data.summary.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat bg-accent text-accent-content rounded-lg">
          <div className="stat-title">Avg Revenue/Customer</div>
          <div className="stat-value">${data.summary.averageRevenuePerCustomer.toFixed(2)}</div>
        </div>
        <div className="stat bg-info text-info-content rounded-lg">
          <div className="stat-title">VIP Customers</div>
          <div className="stat-value">{data.summary.customerSegments.vip}</div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Customer Segments</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.summary.customerSegments).map(([segment, count]) => (
              <div key={segment} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm opacity-70 capitalize">{segment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers Table */}
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
                {data.customerAnalytics.slice(0, 10).map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.totalOrders}</td>
                    <td>${customer.totalSpent.toFixed(2)}</td>
                    <td>${customer.averageOrderValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;