// components/dashboard/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, Search, Filter, Mail, Phone, MapPin, Shield, UserCheck, UserX, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActions, setShowActions] = useState({});

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return;
    }
    fetchUsers();
  }, [user]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data || []);
          setFilteredUsers(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.district.toLowerCase().includes(term) ||
        user.upazila.toLowerCase().includes(term)
      );
    }
    
    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    setFilteredUsers(filtered);
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`User status updated to ${newStatus}`);
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleToggleAdmin = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'donor' : 'admin';
    
    if (!window.confirm(`Are you sure you want to ${newRole === 'admin' ? 'promote to admin' : 'demote to donor'} this user?`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const toggleActions = (userId) => {
    setShowActions(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'donor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <Users className="inline mr-2 h-8 w-8" />
            User Management
          </h1>
          <p className="mt-2 text-gray-600">Manage all system users and permissions</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-2" />
                Search Users
              </label>
              <input
                type="text"
                placeholder="Search by name, email, district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-2" />
                Filter by Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="donor">Donors</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Summary
              </label>
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
                <div className="mt-1 space-x-2">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                    Admins: {users.filter(u => u.role === 'admin').length}
                  </span>
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    Donors: {users.filter(u => u.role === 'donor').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No users found</h3>
            <p className="mt-2 text-gray-600">
              {searchTerm || filterRole !== 'all' 
                ? "No users match your search criteria."
                : "There are no users in the system."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((userItem) => (
              <div key={userItem._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* User Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <img
                        src={userItem.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.name)}&background=random&color=fff`}
                        alt={userItem.name}
                        className="h-12 w-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{userItem.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full mr-2 ${getRoleColor(userItem.role)}`}>
                            {userItem.role === 'admin' ? '👑 Admin' : '🩸 Donor'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(userItem.status)}`}>
                            {userItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => toggleActions(userItem._id)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {showActions[userItem._id] && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                          <div className="py-1">
                            {userItem.role !== 'admin' && (
                              <button
                                onClick={() => handleToggleAdmin(userItem._id, userItem.role)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Make Admin
                              </button>
                            )}
                            
                            {userItem.status === 'active' ? (
                              <button
                                onClick={() => handleUpdateStatus(userItem._id, 'suspended')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Suspend User
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(userItem._id, 'active')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate User
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-bold text-red-600 text-lg">{userItem.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Donations</p>
                      <p className="font-medium text-gray-900">
                        {userItem.totalDonations || 0} times
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* User Details */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm truncate">{userItem.email}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{userItem.district}, {userItem.upazila}</span>
                    </div>
                    
                    {userItem.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{userItem.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      <p>Joined: {formatDate(userItem.createdAt)}</p>
                      <p className="mt-1">Last Active: {userItem.lastActive ? formatDate(userItem.lastActive) : 'Recently'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'donor').length}
            </div>
            <div className="text-sm text-gray-600">Donors</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;