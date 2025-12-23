import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getMyRequests } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  CalendarIcon, 
  MapPinIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMyRequests();
  }, []);

  useEffect(() => {
    // Apply filters whenever requests, statusFilter, or searchTerm changes
    applyFilters();
  }, [requests, statusFilter, searchTerm]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Fetching my requests...');
      
      const data = await getMyRequests();
      console.log('✅ API Response:', data);
      
      // Handle different response formats
      let requestsData = [];
      if (Array.isArray(data)) {
        requestsData = data;
      } else if (data && Array.isArray(data.data)) {
        requestsData = data.data;
      } else if (data && data.success && Array.isArray(data.data)) {
        requestsData = data.data;
      }
      
      console.log('✅ My requests received:', requestsData.length, 'requests');
      setRequests(requestsData);
      
      if (requestsData.length === 0) {
        toast('You have no donation requests yet.', { icon: 'ℹ️' });
      }
      
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      setError('Failed to load your requests. Please try again.');
      toast.error('Failed to load requests');
      
      // Mock data for development
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Using mock data for development');
        setRequests(getMockRequests());
      }
    } finally {
      setLoading(false);
    }
  };

  const getMockRequests = () => {
    return [
      {
        _id: '1',
        recipientName: 'John Doe',
        hospitalName: 'Dhaka Medical College',
        bloodGroup: 'A+',
        district: 'Dhaka',
        upazila: 'Dhanmondi',
        donationDate: new Date().toISOString(),
        donationTime: '10:00 AM',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        recipientName: 'Ahmed Khan',
        hospitalName: 'Square Hospital',
        bloodGroup: 'B+',
        district: 'Dhaka',
        upazila: 'Gulshan',
        donationDate: new Date().toISOString(),
        donationTime: '2:00 PM',
        status: 'inprogress',
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        recipientName: 'Priya Sharma',
        hospitalName: 'Apollo Hospital',
        bloodGroup: 'O+',
        district: 'Chittagong',
        upazila: 'Agrabad',
        donationDate: new Date().toISOString(),
        donationTime: '11:00 AM',
        status: 'done',
        createdAt: new Date().toISOString()
      },
      {
        _id: '4',
        recipientName: 'Rajesh Kumar',
        hospitalName: 'Bangabandhu Hospital',
        bloodGroup: 'AB+',
        district: 'Dhaka',
        upazila: 'Mirpur',
        donationDate: new Date().toISOString(),
        donationTime: '3:00 PM',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        _id: '5',
        recipientName: 'Fatima Begum',
        hospitalName: 'Combined Hospital',
        bloodGroup: 'B-',
        district: 'Sylhet',
        upazila: 'Sylhet Sadar',
        donationDate: new Date().toISOString(),
        donationTime: '9:00 AM',
        status: 'canceled',
        createdAt: new Date().toISOString()
      },
      {
        _id: '6',
        recipientName: 'Mohammad Ali',
        hospitalName: 'Holy Family Hospital',
        bloodGroup: 'A-',
        district: 'Rajshahi',
        upazila: 'Rajshahi Sadar',
        donationDate: new Date().toISOString(),
        donationTime: '1:00 PM',
        status: 'inprogress',
        createdAt: new Date().toISOString()
      }
    ];
  };

  const applyFilters = () => {
    let filtered = [...requests];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        request.recipientName?.toLowerCase().includes(term) ||
        request.hospitalName?.toLowerCase().includes(term) ||
        request.bloodGroup?.toLowerCase().includes(term) ||
        request.district?.toLowerCase().includes(term) ||
        request.upazila?.toLowerCase().includes(term)
      );
    }

    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await fetchMyRequests();
    setTimeout(() => {
      setRefreshLoading(false);
      toast.success('Requests refreshed');
    }, 500);
  };

  const handleView = (id) => {
    navigate(`/dashboard/requests/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-request/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedRequestId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      // Delete API call here
      // await deleteRequest(selectedRequestId);
      
      setRequests(requests.filter(req => req._id !== selectedRequestId));
      setDeleteModalOpen(false);
      setSelectedRequestId(null);
      toast.success('Request deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete request');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { 
        label: 'Pending', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: '⏳'
      },
      inprogress: { 
        label: 'In Progress', 
        className: 'bg-blue-100 text-blue-800',
        icon: '🔄'
      },
      done: { 
        label: 'Completed', 
        className: 'bg-green-100 text-green-800',
        icon: '✅'
      },
      canceled: { 
        label: 'Canceled', 
        className: 'bg-red-100 text-red-800',
        icon: '❌'
      }
    };
    const { label, className, icon } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${className}`}>
        <span>{icon}</span>
        {label}
      </span>
    );
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    toast(`Showing ${status === 'all' ? 'all' : status} requests`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading your donation requests...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Donation Requests</h1>
              <p className="text-gray-600 mt-2">
                Manage all your blood donation requests
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-4 h-4 ${refreshLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => navigate('/dashboard/create-donation-request')}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                + Create New Request
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'pending').length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500">In Progress</div>
              <div className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === 'inprogress').length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500">Completed</div>
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'done').length}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={fetchMyRequests}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by recipient, hospital, blood group, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex flex-wrap gap-2">
            {statusFilter !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Status: {statusFilter}
              </span>
            )}
            {searchTerm && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
              Showing {filteredRequests.length} of {requests.length} requests
            </span>
          </div>
        </div>

        {/* Table View */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No requests match your search criteria.' 
                : 'You haven\'t created any donation requests yet.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                navigate('/dashboard/create-donation-request');
              }}
              className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Create Your First Request
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hospital & Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Group & Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{request.recipientName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{request.hospitalName}</div>
                            <div className="text-sm text-gray-500">
                              {request.district}, {request.upazila}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="inline-flex items-center justify-center w-12 h-8 bg-red-50 text-red-700 font-bold rounded-md">
                                {request.bloodGroup}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(request.donationDate).toLocaleDateString()} at {request.donationTime}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView(request._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                              <EyeIcon className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(request._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(request._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredRequests.length)}
                  </span> of{' '}
                  <span className="font-medium">{filteredRequests.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-red-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setDeleteModalOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Request
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this donation request? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    disabled={actionLoading}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;