import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, ShoppingBag, Package, CreditCard, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load user profile data
    const loadProfile = async () => {
      try {
        console.log('Profile token:', token);
        console.log('User in profile:', user);
        
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            address: {
              street: data.user.address?.street || '',
              city: data.user.address?.city || '',
              state: data.user.address?.state || '',
              zipCode: data.user.address?.zipCode || '',
              country: data.user.address?.country || ''
            }
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    loadProfile();
  }, [user, token, navigate]);

  useEffect(() => {
    // Load user orders when orders tab is active
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab, token]);

   const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Handle different response structures
        const ordersData = data.orders || data || [];
        // Sort orders by date (newest first)
        const sortedOrders = Array.isArray(ordersData) 
          ? ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setOrders(sortedOrders);
      } else {
        const errorData = await response.json();
        console.error('Load orders error:', errorData);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]); // Set empty array on error
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                <p className="text-blue-100">{profileData.email}</p>
                <p className="text-sm text-blue-200 mt-1">Member since {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-8">
              {[
                { id: 'personal', label: 'Personal Information', icon: User },
                { id: 'address', label: 'Address', icon: MapPin },
                { id: 'orders', label: 'Order History', icon: ShoppingBag },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mx-8 mt-4 p-4 rounded-md ${
              message.type === 'error' 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'personal' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      disabled={true}
                      className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-600"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Address Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address.street"
                      value={profileData.address.street}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={profileData.address.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={profileData.address.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={profileData.address.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={profileData.address.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">You haven't placed any orders yet</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                           <h3 className="text-lg font-semibold">Order #{order._id?.slice(-8) || order.orderNumber}</h3>
                            <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Items:</p>
                          <div className="space-y-2">
                             {order.items && order.items.map((item, index) => (
                               <div key={index} className="flex justify-between text-sm">
                                 <span>{item.productId?.name || item.name || 'Product'} x {item.quantity || item.qty || 0}</span>
                                 <span>৳{((item.price || item.productId?.price || 0) * (item.quantity || item.qty || 0)).toFixed(2)}</span>
                               </div>
                             ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                           <div>
                             <p className="text-sm text-gray-600">Total Amount:</p>
                             <p className="text-xl font-bold text-gray-800">৳{(order.totalAmount || order.total || 0).toFixed(2)}</p>
                           </div>
                          <button
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;