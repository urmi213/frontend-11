import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  getAllRequestsAdmin, 
  updateRequestStatus 
} from '../../../services/api';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const VolunteerAllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllRequestsAdmin();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await fetchRequests();
    setTimeout(() => setRefreshLoading(false), 500);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (updatingId) return;
    
    try {
      setUpdatingId(id);
      await updateRequestStatus(id, newStatus);
      
      // Update UI
      setRequests(requests.map(req => 
        req._id === id ? { ...req, status: newStatus } : req
      ));
      
      // Show success message
      showToast(`Status updated to ${getStatusLabel(newStatus)}`, 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/dashboard/requests/${id}`);
  };

  const showToast = (message, type = 'info') => {
    // You can use a toast library here
    alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'Pending',
      inprogress: 'In Progress',
      done: 'Completed',
      canceled: 'Canceled'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      inprogress: 'bg-blue-100 text-blue-800',
      done: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    // Status filter
    if (filter !== 'all' && request.status !== filter) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        request.recipientName?.toLowerCase().includes(term) ||
        request.hospitalName?.toLowerCase().includes(term) ||
        request.bloodGroup?.toLowerCase().includes(term) ||
        request.district?.toLowerCase().includes(term) ||
        request.upazila?.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading donation requests...</p>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Blood Donation Requests</h1>
              <p className="text-gray-600 mt-2">Manage and update status of donation requests (Volunteer Mode)</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500">Total Requests</div>
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

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by recipient, hospital, blood group..."
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
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
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
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions (Volunteer)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <ClockIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                        <p className="text-gray-600 max-w-md">
                          {searchTerm || filter !== 'all' 
                            ? 'No requests match your search criteria.' 
                            : 'No donation requests available at the moment.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{request.recipientName}</div>
                          <div className="text-sm text-gray-500">
                            Requested by: {request.requesterName || request.userId?.name || 'Unknown'}
                          </div>
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
                        <span className="inline-flex items-center justify-center w-12 h-8 bg-red-50 text-red-700 font-bold rounded-md">
                          {request.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(request.donationDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">{request.donationTime}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {/* Volunteer can only update status */}
                          {request.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'inprogress')}
                              disabled={updatingId === request._id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
                            >
                              <ArrowPathIcon className="w-4 h-4" />
                              Start Processing
                            </button>
                          )}
                          
                          {request.status === 'inprogress' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(request._id, 'done')}
                                disabled={updatingId === request._id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                                Mark Done
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(request._id, 'canceled')}
                                disabled={updatingId === request._id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                              >
                                <XCircleIcon className="w-4 h-4" />
                                Cancel
                              </button>
                            </>
                          )}
                          
                          {/* View Details Button - Allowed for all statuses */}
                          <button
                            onClick={() => handleViewDetails(request._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination/Info */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredRequests.length}</span> of{' '}
                <span className="font-medium">{requests.length}</span> requests
                {filter !== 'all' && ` (filtered by ${getStatusLabel(filter)})`}
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                  Volunteer Mode: Can only update status
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Guidelines */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Volunteer Guidelines</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>You can view all donation requests</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>You can update donation status (Pending → In Progress → Completed/Canceled)</span>
            </li>
            <li className="flex items-start">
              <XCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>You cannot edit or delete donation requests</span>
            </li>
            <li className="flex items-start">
              <XCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>You cannot manage users or change roles</span>
            </li>
            <li className="flex items-start">
              <XCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>You cannot access funding management</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VolunteerAllRequests;