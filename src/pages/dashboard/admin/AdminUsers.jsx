// components/dashboard/AdminUsers.jsx - SIMPLE VERSION
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, Search, Shield, Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

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
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Block/Unblock User
  const handleBlock = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    
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
        toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update user');
    }
  };

  // Make Volunteer
  const handleMakeVolunteer = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'volunteer' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('User made volunteer');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update role');
    }
  };

  // Make Admin
  const handleMakeAdmin = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'admin' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('User made admin');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update role');
    }
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
          <p className="mt-2 text-gray-600">Manage all system users</p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={userItem.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.name)}&background=random&color=fff`}
                          alt={userItem.name}
                          className="h-10 w-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">{userItem.name}</p>
                          <p className="text-sm text-gray-500">{userItem.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        userItem.role === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        userItem.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {userItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {userItem.status === 'active' ? (
                          <button
                            onClick={() => handleBlock(userItem._id, userItem.status)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                          >
                            <Lock className="inline h-3 w-3 mr-1" />
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(userItem._id, userItem.status)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                          >
                            <Unlock className="inline h-3 w-3 mr-1" />
                            Unblock
                          </button>
                        )}
                        
                        {userItem.role === 'donor' && (
                          <button
                            onClick={() => handleMakeVolunteer(userItem._id)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                          >
                            <Shield className="inline h-3 w-3 mr-1" />
                            Make Volunteer
                          </button>
                        )}
                        
                        {userItem.role !== 'admin' && (
                          <button
                            onClick={() => handleMakeAdmin(userItem._id)}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
                          >
                            <Shield className="inline h-3 w-3 mr-1" />
                            Make Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
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