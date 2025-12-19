import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Shield,
  UserCheck,
  UserX,
  Mail,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchUsers();
  }, [user, navigate]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus]);

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

  const filterUsers = () => {
    let filtered = [...users];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(term) || 
        u.email.toLowerCase().includes(term)
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(u => u.status === filterStatus);
    }
    
    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId, action, value) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [action]: value })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`User ${action} updated successfully`);
        fetchUsers();
        setShowActionsMenu(null);
      } else {
        toast.error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const getAvatarUrl = (user) => {
    if (user.avatar && user.avatar.startsWith('http')) {
      return user.avatar;
    }
    
    const name = user.name || user.email || 'User';
    const encodedName = encodeURIComponent(name);
    const background = user.role === 'admin' ? '8b5cf6' : user.role === 'volunteer' ? 'f59e0b' : 'dc2626';
    
    return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=fff`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      volunteer: 'bg-yellow-100 text-yellow-800',
      donor: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <Users className="inline mr-2 h-6 w-6" />
                User Management
              </h1>
              <p className="mt-1 text-gray-600">Manage all users in the system</p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-2" />
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
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
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Active: {users.filter(u => u.status === 'active').length}
                  </span>
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                    Blocked: {users.filter(u => u.status === 'blocked').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={getAvatarUrl(userItem)}
                          alt={userItem.name}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.name || 'User')}`;
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {userItem.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(userItem.role)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(userItem.status)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-gray-900">{userItem.bloodGroup}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {userItem.district}
                      </div>
                      <div className="text-sm text-gray-500">
                        {userItem.upazila}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionsMenu(showActionsMenu === userItem._id ? null : userItem._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>
                        
                        {showActionsMenu === userItem._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                            <div className="py-1">
                              {/* Block/Unblock */}
                              {userItem.status === 'active' ? (
                                <button
                                  onClick={() => handleUserAction(userItem._id, 'status', 'blocked')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Block User
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(userItem._id, 'status', 'active')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Unblock User
                                </button>
                              )}
                              
                              {/* Make Volunteer */}
                              {userItem.role === 'donor' && (
                                <button
                                  onClick={() => handleUserAction(userItem._id, 'role', 'volunteer')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                >
                                  👥 Make Volunteer
                                </button>
                              )}
                              
                              {/* Make Admin */}
                              {userItem.role !== 'admin' && (
                                <button
                                  onClick={() => handleUserAction(userItem._id, 'role', 'admin')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </button>
                              )}
                              
                              <div className="border-t my-1"></div>
                              
                              <button
                                onClick={() => navigate(`/dashboard/profile/${userItem._id}`)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                View Profile
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm ? 'Try a different search term' : 'No users in the system'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;