import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Shield,
  User,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  UserPlus
} from 'lucide-react';

const UserManagement = () => {
  const { user: adminUser, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  useEffect(() => {
    if (!adminUser || adminUser.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [adminUser, token, navigate, pagination.current, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current,
        limit: pagination.limit,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });

      const response = await fetch(`/api/auth/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || data.users?.length || 0,
        pages: Math.ceil((data.total || data.users?.length || 0) / pagination.limit)
      }));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err.message);
    }
  };

  const deactivateUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      const response = await fetch(`/api/auth/users/${userId}/deactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate user');
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, status: 'inactive' } : user
      ));
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(prev => ({ ...prev, status: 'inactive' }));
      }
    } catch (err) {
      console.error('Error deactivating user:', err);
      setError(err.message);
    }
  };

  const activateUser = async (userId) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to activate user');
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, status: 'active' } : user
      ));
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(prev => ({ ...prev, status: 'active' }));
      }
    } catch (err) {
      console.error('Error activating user:', err);
      setError(err.message);
    }
  };

  const exportUsers = async () => {
    try {
      const response = await fetch('/api/auth/users/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export users');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting users:', err);
      setError(err.message);
    }
  };

  const UserModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">User Details</h2>
            <button 
              className="btn btn-circle btn-ghost"
              onClick={() => setSelectedUser(null)}
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.fullName || selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Role:</span>
                  <span className={`badge badge-${selectedUser.role === 'admin' ? 'error' : 'success'}`}>
                    {selectedUser.role || 'user'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Phone:</span>
                  <span>{selectedUser.phone || 'Not provided'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Member Since:</span>
                  <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Status:</span>
                  <span className={`badge badge-${selectedUser.status === 'active' ? 'success' : 'error'}`}>
                    {selectedUser.status || 'active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Address Information</h3>
              {selectedUser.address ? (
                <div className="text-sm space-y-1">
                  <p>{selectedUser.address.street}</p>
                  <p>{selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}</p>
                  <p>{selectedUser.address.country}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No address provided</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            {selectedUser._id !== adminUser._id && (
              <>
                <select
                  className="select select-bordered"
                  value={selectedUser.role || 'user'}
                  onChange={(e) => updateUserRole(selectedUser._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                {selectedUser.status === 'active' ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => deactivateUser(selectedUser._id)}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => activateUser(selectedUser._id)}
                  >
                    Activate
                  </button>
                )}
              </>
            )}
            
            <button
              className="btn btn-ghost"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportUsers}
            className="btn btn-outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost ml-4" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="card bg-base-100 shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-control">
            <div className="input-group">
              <span className="bg-base-200 border border-r-0 border-base-300 px-3">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search users..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="form-control">
            <select
              className="select select-bordered w-full"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div className="form-control">
            <select
              className="select select-bordered w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-control">
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setStatusFilter('');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{user.fullName || user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${user.role === 'admin' ? 'error' : 'success'}`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${user.status === 'active' ? 'success' : 'error'}`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {user._id !== adminUser._id && (
                        <>
                          {user.status === 'active' ? (
                            <button
                              className="btn btn-warning btn-xs"
                              onClick={() => deactivateUser(user._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              className="btn btn-success btn-xs"
                              onClick={() => activateUser(user._id)}
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && !loading && (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-2 p-4">
            <button
              className="btn btn-sm"
              disabled={pagination.current === 1}
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="px-4">
              Page {pagination.current} of {pagination.pages}
            </span>
            
            <button
              className="btn btn-sm"
              disabled={pagination.current === pagination.pages}
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <UserModal />
    </div>
  );
};

export default UserManagement;