import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import { Droplets, Clock, CheckCircle, XCircle, Edit, Trash2, Eye } from 'lucide-react';

const MyRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyRequests();
  }, [filter]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/requests/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Filter requests based on selected filter
        let filteredRequests = data.data || [];
        
        if (filter !== 'all') {
          filteredRequests = filteredRequests.filter(req => req.status === filter);
        }
        
        setRequests(filteredRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load donation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Request deleted successfully');
        fetchMyRequests();
      } else {
        toast.error(data.message || 'Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchMyRequests();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'inprogress': return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'done': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inprogress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🩸 My Donation Requests</h1>
          <p className="mt-2 text-gray-600">Manage your blood donation requests</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All ({requests.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('inprogress')}
              className={`px-4 py-2 rounded-lg ${filter === 'inprogress' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('done')}
              className={`px-4 py-2 rounded-lg ${filter === 'done' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg ${filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Requests Table */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <Droplets className="h-16 w-16 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No requests found</h3>
            <p className="mt-2 text-gray-600">
              {filter === 'all' 
                ? "You haven't created any donation requests yet."
                : `No ${filter} requests found.`
              }
            </p>
            <button
              onClick={() => navigate('/dashboard/create-request')}
              className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Create Your First Request
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {request.recipientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.hospitalName}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="font-bold text-red-600">
                          {request.bloodGroup}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {request.recipientDistrict}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.recipientUpazila}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(request.donationDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.donationTime}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(request.status)}
                          <span className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/dashboard/request/${request._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {request.status === 'inprogress' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(request._id, 'done')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                title="Mark as Done"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(request._id, 'cancelled')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Cancel Request"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => handleDeleteRequest(request._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Request"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === 'inprogress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'done').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;