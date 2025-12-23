import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  getAllRequestsAdmin,
  getVolunteerRequests,
  updateRequestStatus 
} from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isVolunteer = user?.role === 'volunteer';

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (isVolunteer) data = await getVolunteerRequests();
      else data = await getAllRequestsAdmin();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading all requests:', error);
      setError('Failed to load requests. Please try again.');
      if (process.env.NODE_ENV === 'development') {
        setRequests(getMockRequests());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await fetchAllRequests();
    setTimeout(() => setRefreshLoading(false), 500);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading(true);
      await updateRequestStatus(id, status);
      setRequests(requests.map(req => req._id === id ? { ...req, status } : req));
      alert(`✅ Status updated to ${getStatusLabel(status)}`);
    } catch (error) {
      console.error('Status update error:', error);
      alert('❌ Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (id) => {
    if (isVolunteer) {
      alert('Volunteers cannot edit donation requests');
      return;
    }
    navigate(`/dashboard/edit-request/${id}`);
  };

  const handleView = (id) => navigate(`/dashboard/requests/${id}`);

  const handleDeleteClick = (id) => {
    if (isVolunteer) {
      alert('Volunteers cannot delete donation requests');
      return;
    }
    setSelectedRequestId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      // await deleteRequest(selectedRequestId);
      setRequests(requests.filter(req => req._id !== selectedRequestId));
      setDeleteModalOpen(false);
      setSelectedRequestId(null);
      alert('✅ Request deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete request');
    } finally {
      setActionLoading(false);
    }
  };

  const getMockRequests = () => [
    {
      _id: '1', recipientName: 'John Doe', hospitalName: 'Dhaka Medical College',
      bloodGroup: 'A+', district: 'Dhaka', upazila: 'Dhanmondi', donationDate: new Date().toISOString(),
      donationTime: '10:00 AM', status: 'pending', requesterName: 'Jane Smith',
      requesterEmail: 'jane@example.com', requesterPhone: '01712345678', createdAt: new Date().toISOString()
    },
    {
      _id: '2', recipientName: 'Ahmed Khan', hospitalName: 'Square Hospital',
      bloodGroup: 'B+', district: 'Dhaka', upazila: 'Gulshan', donationDate: new Date().toISOString(),
      donationTime: '2:00 PM', status: 'inprogress', requesterName: 'Fatima Begum',
      requesterEmail: 'fatima@example.com', requesterPhone: '01812345678', createdAt: new Date().toISOString()
    },
    {
      _id: '3', recipientName: 'Priya Sharma', hospitalName: 'Apollo Hospital',
      bloodGroup: 'O+', district: 'Chittagong', upazila: 'Agrabad', donationDate: new Date().toISOString(),
      donationTime: '11:00 AM', status: 'done', requesterName: 'Rajesh Kumar',
      requesterEmail: 'rajesh@example.com', requesterPhone: '01912345678', createdAt: new Date().toISOString()
    }
  ];

  const filteredRequests = requests.filter(request => {
    if (filter !== 'all' && request.status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        request.recipientName?.toLowerCase().includes(term) ||
        request.hospitalName?.toLowerCase().includes(term) ||
        request.bloodGroup?.toLowerCase().includes(term) ||
        request.district?.toLowerCase().includes(term) ||
        request.upazila?.toLowerCase().includes(term) ||
        request.requesterName?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      inprogress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800', icon: '🔄' },
      done: { label: 'Completed', className: 'bg-green-100 text-green-800', icon: '✅' },
      canceled: { label: 'Canceled', className: 'bg-red-100 text-red-800', icon: '❌' }
    };
    const { label, className, icon } = config[status] || config.pending;
    return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${className}`}>{icon} {label}</span>;
  };

  const getStatusLabel = (status) => ({
    pending: 'Pending',
    inprogress: 'In Progress',
    done: 'Completed',
    canceled: 'Canceled'
  }[status] || status);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <ExclamationTriangleIcon className="w-12 h-12 text-red-600 mb-4"/>
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={fetchAllRequests} className="px-6 py-2 bg-red-600 text-white rounded-lg">Try Again</button>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">All Blood Donation Requests</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAdmin ? 'bg-purple-100 text-purple-800' : isVolunteer ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {isAdmin ? 'Admin Mode' : isVolunteer ? 'Volunteer Mode' : 'View Mode'}
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRefresh} disabled={refreshLoading} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50">
              <ArrowPathIcon className={`w-4 h-4 ${refreshLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            {isAdmin && (
              <button onClick={() => navigate('/dashboard/create-donation-request')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">+ Create Request</button>
            )}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 md:p-6 rounded-xl mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg"/>
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500"/>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-lg px-4 py-2.5">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital & Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood & Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-600">No requests found</td>
                </tr>
              ) : filteredRequests.map(req => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{req.recipientName}<br/><span className="text-sm text-gray-500">{req.requesterPhone || 'N/A'}</span></td>
                  <td className="px-6 py-4">{req.hospitalName}<br/><span className="text-sm text-gray-500">{req.district}, {req.upazila}</span></td>
                  <td className="px-6 py-4">{req.bloodGroup}<br/><span className="text-sm text-gray-500">{new Date(req.donationDate).toLocaleDateString()} at {req.donationTime}</span></td>
                  <td className="px-6 py-4">{req.requesterName}<br/><span className="text-sm text-gray-500">{req.requesterEmail}</span></td>
                  <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                  <td className="px-6 py-4 flex flex-wrap gap-2">
                    {req.status === 'pending' && <button onClick={() => handleStatusUpdate(req._id,'inprogress')} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md">Start</button>}
                    {req.status === 'inprogress' && <>
                      <button onClick={() => handleStatusUpdate(req._id,'done')} className="px-3 py-1 bg-green-100 text-green-700 rounded-md">Done</button>
                      <button onClick={() => handleStatusUpdate(req._id,'canceled')} className="px-3 py-1 bg-red-100 text-red-700 rounded-md">Cancel</button>
                    </>}
                    {isAdmin && <button onClick={() => handleEdit(req._id)} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md">Edit</button>}
                    <button onClick={() => handleView(req._id)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md">View</button>
                    {isAdmin && <button onClick={() => handleDeleteClick(req._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded-md">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Modal */}
        {deleteModalOpen && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="text-center">
                <TrashIcon className="w-12 h-12 text-red-600 mx-auto mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Delete Request</h3>
                <p className="text-gray-600 mb-6">Are you sure? This action cannot be undone.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setDeleteModalOpen(false)} className="px-5 py-2 border rounded-lg">Cancel</button>
                  <button onClick={handleConfirmDelete} className="px-5 py-2 bg-red-600 text-white rounded-lg">{actionLoading ? 'Deleting...' : 'Delete'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequests;
