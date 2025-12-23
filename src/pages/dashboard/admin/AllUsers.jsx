import React, { useState, useEffect } from 'react';
 
import { getAllUsers, updateUserStatus, updateUserRole } from '../../../services/api';

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Loading users from /admin/users...');
      
      const response = await getAllUsers();
      console.log('📦 API Response:', response);
      
      // 🔍 Debug: Check response structure
      console.log('🔍 Response keys:', Object.keys(response));
      console.log('🔍 Response data:', response.data);
      console.log('🔍 Is array?', Array.isArray(response.data));
      
      let userList = [];
      
      // Handle different response structures
      if (response && response.success === true) {
        // Case 1: { success: true, data: [...] }
        if (response.data && Array.isArray(response.data)) {
          userList = response.data;
        } 
        // Case 2: { success: true, users: [...] }
        else if (response.users && Array.isArray(response.users)) {
          userList = response.users;
        }
      } 
      // Case 3: Direct array response
      else if (Array.isArray(response)) {
        userList = response;
      }
      // Case 4: { data: { users: [...] } }
      else if (response.data && response.data.users && Array.isArray(response.data.users)) {
        userList = response.data.users;
      }
      
      console.log(`✅ Extracted ${userList.length} users`);
      
      // Apply filter
      if (filter === 'active') {
        userList = userList.filter(user => user.status === 'active');
      } else if (filter === 'blocked') {
        userList = userList.filter(user => user.status === 'blocked');
      }
      
      setUsers(userList || []);
      
    } catch (error) {
      console.error('❌ Error loading users:', error);
      setError('Failed to load users. Please check server connection.');
      // Fallback to mock data
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  // Temporary mock data
  const getMockUsers = () => {
    return [
      { 
        _id: '1', 
        name: 'Admin User', 
        email: 'admin@gmail.com', 
        role: 'admin', 
        status: 'active', 
        district: 'Dhaka', 
        upazila: 'Gulshan', 
        avatar: null,
        bloodGroup: 'O+',
        createdAt: new Date(),
        totalDonations: 0
      },
      { 
        _id: '2', 
        name: 'Donor One', 
        email: 'donor1@test.com', 
        role: 'donor', 
        status: 'active', 
        district: 'Chittagong', 
        upazila: 'Agrabad', 
        bloodGroup: 'A+', 
        avatar: null,
        createdAt: new Date(),
        totalDonations: 2
      },
      { 
        _id: '3', 
        name: 'Donor Two', 
        email: 'donor2@test.com', 
        role: 'donor', 
        status: 'blocked', 
        district: 'Sylhet', 
        upazila: 'Sylhet Sadar', 
        bloodGroup: 'B+', 
        avatar: null,
        createdAt: new Date(),
        totalDonations: 0
      },
    ];
  };

  const handleBlockUser = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      
      // Update in backend
      await updateUserStatus(userId, { status: newStatus });
      
      // Update UI
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      
      alert(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update user status');
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await updateUserRole(userId, { role: 'admin' });
      
      // Update UI
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: 'admin' } : user
      ));
      
      alert('User is now admin');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update user role');
    }
  };

  const handleMakeVolunteer = async (userId) => {
    try {
      await updateUserRole(userId, { role: 'volunteer' });
      
      // Update UI
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: 'volunteer' } : user
      ));
      
      alert('User is now volunteer');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update user role');
    }
  };

  const getAvatarUrl = (user) => {
    if (user.avatar) return user.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=dc2626&color=fff&size=128`;
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'volunteer': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Users</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={loadUsers}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
            <button
              onClick={() => setUsers(getMockUsers())}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Use Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage users, roles and permissions ({users.length} users)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Buttons */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'active' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('blocked')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'blocked' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Blocked
            </button>
          </div>
          
          <button 
            onClick={loadUsers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {!Array.isArray(users) || users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">👤</span>
            </div>
            <p className="text-gray-500">No users found</p>
            <button
              onClick={loadUsers}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Load Users
            </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <img
                              src={getAvatarUrl(user)}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=dc2626&color=fff&size=128`;
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              Blood: <span className="font-bold text-red-600">{user.bloodGroup || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">
                          Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.district || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{user.upazila || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {/* Block/Unblock Button */}
                          <button
                            onClick={() => handleBlockUser(user._id, user.status)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${user.status === 'active' 
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                              : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            {user.status === 'active' ? '🚫 Block' : '✅ Unblock'}
                          </button>

                          {/* Make Admin Button */}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleMakeAdmin(user._id)}
                              className="px-3 py-1.5 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-200"
                            >
                              👑 Make Admin
                            </button>
                          )}

                          {/* Make Volunteer Button */}
                          {user.role === 'donor' && (
                            <button
                              onClick={() => handleMakeVolunteer(user._id)}
                              className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200"
                            >
                              🤝 Make Volunteer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {users.length} user{users.length !== 1 ? 's' : ''}
                  {filter !== 'all' && ` (Filtered by: ${filter})`}
                </div>
                <div className="flex gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Active:</span>{' '}
                    <span className="font-medium">
                      {users.filter(u => u.status === 'active').length}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Admins:</span>{' '}
                    <span className="font-medium">
                      {users.filter(u => u.role === 'admin').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;