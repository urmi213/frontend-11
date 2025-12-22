// pages/admin/AllUsers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Shield,
  ShieldOff,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  Calendar,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800' },
    { value: 'volunteer', label: 'Volunteer', color: 'bg-blue-100 text-blue-800' },
    { value: 'donor', label: 'Donor', color: 'bg-red-100 text-red-800' }
  ];

  // Fetch users with pagination
  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          role: filterRole !== 'all' ? filterRole : undefined
        }
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.totalUsers);
        setCurrentPage(response.data.pagination.currentPage - 1);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, filterRole]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  // Handle user actions
  const handleUserAction = async (userId, action, confirmMessage = null) => {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      let method = 'PUT';
      let successMessage = '';

      switch (action) {
        case 'block':
          endpoint = `/admin/users/${userId}/block`;
          successMessage = 'User blocked successfully';
          break;
        case 'unblock':
          endpoint = `/admin/users/${userId}/unblock`;
          successMessage = 'User unblocked successfully';
          break;
        case 'makeVolunteer':
          endpoint = `/admin/users/${userId}/role`;
          successMessage = 'User promoted to volunteer';
          break;
        case 'makeAdmin':
          endpoint = `/admin/users/${userId}/role`;
          successMessage = 'User promoted to admin';
          break;
        case 'delete':
          endpoint = `/admin/users/${userId}`;
          method = 'DELETE';
          successMessage = 'User deleted successfully';
          break;
        default:
          return;
      }

      const response = await axios({
        method,
        url: `${process.env.REACT_APP_API_URL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: action.includes('make') ? { role: action.replace('make', '').toLowerCase() } : undefined
      });

      if (response.data.success) {
        toast.success(successMessage);
        fetchUsers(currentPage + 1);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} user`);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    if (!window.confirm(`Are you sure you want to ${action} ${selectedUsers.length} user(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/users/bulk-action`,
        {
          userIds: selectedUsers,
          action: action
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`${response.data.updatedCount} user(s) ${action}ed successfully`);
        setSelectedUsers([]);
        fetchUsers(currentPage + 1);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all users on current page
  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
  };

  // Handle page change
  const handlePageClick = ({ selected }) => {
    fetchUsers(selected + 1);
  };

  // Export users to CSV
  const exportToCSV = () => {
    const csvData = users.map(user => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone || 'N/A',
      Role: user.role,
      Status: user.status,
      'Blood Group': user.bloodGroup || 'N/A',
      District: user.district || 'N/A',
      Upazila: user.upazila || 'N/A',
      'Created At': new Date(user.createdAt).toLocaleDateString()
    }));

    const csvHeaders = Object.keys(csvData[0]).join(',');
    const csvRows = csvData.map(row => 
      Object.values(row).map(value => 
        `"${value}"`
      ).join(',')
    ).join('\n');

    const csvContent = csvHeaders + '\n' + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Render user status badge
  const renderStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} /> },
      blocked: { color: 'bg-red-100 text-red-800', icon: <XCircle size={12} /> },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle size={12} /> }
    };

    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  // Render role badge
  const renderRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800', icon: '👑' },
      volunteer: { color: 'bg-blue-100 text-blue-800', icon: '🤝' },
      donor: { color: 'bg-red-100 text-red-800', icon: '🩸' }
    };

    const config = roleConfig[role] || roleConfig.donor;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        <span className="capitalize">{role}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👥 User Management</h1>
          <p className="text-gray-600 mt-1">
            Total {totalUsers} users • {selectedUsers.length} selected
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => fetchUsers(currentPage + 1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-blue-800">
                {selectedUsers.length} user(s) selected
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('block')}
                className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition"
              >
                Block Selected
              </button>
              <button
                onClick={() => handleBulkAction('unblock')}
                className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md text-sm font-medium transition"
              >
                Unblock Selected
              </button>
              <button
                onClick={() => handleBulkAction('makeVolunteer')}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium transition"
              >
                Make Volunteer
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchUsers(1)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={14} className="inline mr-1" />
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={14} className="inline mr-1" />
              Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterRole('all');
              fetchUsers(1);
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Clear Filters
          </button>
          <button
            onClick={() => fetchUsers(1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={selectAllUsers}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
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
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {user.bloodGroup && (
                            <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                              🩸 {user.bloodGroup}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.phone ? (
                        <div className="flex items-center space-x-2">
                          <Phone size={14} />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No phone</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} />
                        <span className="truncate max-w-xs">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.district || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.upazila || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {/* View Profile */}
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Profile"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Status Actions */}
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUserAction(user._id, 'block', `Are you sure you want to block ${user.name}?`)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Block User"
                        >
                          <ShieldOff size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user._id, 'unblock')}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Unblock User"
                        >
                          <Shield size={18} />
                        </button>
                      )}

                      {/* Role Actions */}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleUserAction(user._id, 'makeAdmin', `Promote ${user.name} to Admin?`)}
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title="Make Admin"
                        >
                          <UserPlus size={18} />
                        </button>
                      )}
                      
                      {user.role === 'donor' && (
                        <button
                          onClick={() => handleUserAction(user._id, 'makeVolunteer', `Promote ${user.name} to Volunteer?`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Make Volunteer"
                        >
                          <UserPlus size={18} />
                        </button>
                      )}

                      {/* More Options */}
                      <div className="relative">
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <MoreVertical size={18} />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                          <div className="py-1">
                            <button
                              onClick={() => handleUserAction(user._id, 'delete', `Are you sure you want to delete ${user.name}? This action cannot be undone.`)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete User
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="text-gray-400" size={48} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => fetchUsers(currentPage)}
              disabled={currentPage === 0}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => fetchUsers(currentPage + 2)}
              disabled={currentPage === totalPages - 1}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === totalPages - 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{users.length}</span> of{' '}
                <span className="font-medium">{totalUsers}</span> users
              </p>
            </div>
            <div>
              <ReactPaginate
                previousLabel={'← Previous'}
                nextLabel={'Next →'}
                breakLabel={'...'}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                forcePage={currentPage}
                containerClassName={'flex items-center space-x-2'}
                pageClassName={'hidden sm:block'}
                pageLinkClassName={'px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-50'}
                previousLinkClassName={`px-3 py-1.5 border border-gray-300 text-sm rounded-md ${
                  currentPage === 0 ? 'text-gray-300' : 'hover:bg-gray-50'
                }`}
                nextLinkClassName={`px-3 py-1.5 border border-gray-300 text-sm rounded-md ${
                  currentPage === totalPages - 1 ? 'text-gray-300' : 'hover:bg-gray-50'
                }`}
                activeLinkClassName={'bg-blue-50 border-blue-500 text-blue-600'}
                disabledClassName={'text-gray-300 cursor-not-allowed'}
                breakClassName={'px-2'}
                breakLinkClassName={'text-gray-500'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;