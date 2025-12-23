import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Heart,
  Trash2,
  Edit,
  Filter,
  Search,
  RefreshCw,
  LogIn,
  FileText,
  XCircle,
  PlayCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router'; // ✅ Fixed import

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('User not logged in, showing empty state');
      setLoading(false);
      setRequests([]);
      return;
    }
    
    // If token exists, fetch requests
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token available');
        setRequests([]);
        setLoading(false);
        return;
      }
      
      // ✅ CORRECT ENDPOINT: /api/dashboard/my-requests
      const response = await fetch('http://https://myapp-cq1llcwyg-urmis-projects-37af7542.vercel.app/api/dashboard/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      if (data && data.success) {
        const requestsData = data.data || [];
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      } else {
        setRequests([]);
      }
      
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please login again.');
      }
      
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://https://myapp-cq1llcwyg-urmis-projects-37af7542.vercel.app/api/dashboard/requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://https://myapp-cq1llcwyg-urmis-projects-37af7542.vercel.app/api/dashboard/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Request status updated to ${newStatus}`);
        fetchMyRequests();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
      }
    } catch (error) {
      return 'Recently';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inprogress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inprogress': return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case 'canceled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'inprogress': return 'In Progress';
      case 'done': return 'Completed';
      case 'canceled': return 'Canceled';
      default: return status;
    }
  };

  const filteredRequests = Array.isArray(requests) 
    ? requests.filter(request => {
        if (!request || typeof request !== 'object') return false;
        if (filterStatus === 'all') return true;
        return request.status === filterStatus;
      })
    : [];

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Blood Requests</h1>
          <p className="text-gray-600">
            {isLoggedIn 
              ? 'Manage and track your blood donation requests' 
              : 'Login to view and manage your blood requests'}
          </p>
        </div>

        {/* Login Prompt (if not logged in) */}
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                  <LogIn className="h-8 w-8 mr-3" />
                  <h2 className="text-2xl font-bold">Login Required</h2>
                </div>
                <p className="text-red-100 mb-4">
                  Please login to view your blood donation requests. 
                  Once logged in, you can create, manage, and track all your requests.
                </p>
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Login Now
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-red-600 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <Heart className="h-24 w-24 text-white opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards (only show if logged in and has data) */}
        {isLoggedIn && requests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg mr-4">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{requests.length}</p>
                  <p className="text-gray-600">Total Requests</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {(requests.filter(r => r?.status === 'pending') || []).length}
                  </p>
                  <p className="text-gray-600">Pending</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {(requests.filter(r => r?.status === 'done') || []).length}
                  </p>
                  <p className="text-gray-600">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredRequests.length}
                  </p>
                  <p className="text-gray-600">Filtered</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs (only show if logged in and has data) */}
        {isLoggedIn && requests.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Requests ({requests.length || 0})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'pending' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({(requests.filter(r => r?.status === 'pending') || []).length})
              </button>
              <button
                onClick={() => setFilterStatus('inprogress')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'inprogress' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Progress ({(requests.filter(r => r?.status === 'inprogress') || []).length})
              </button>
              <button
                onClick={() => setFilterStatus('done')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'done' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed ({(requests.filter(r => r?.status === 'done') || []).length})
              </button>
              <button
                onClick={() => setFilterStatus('canceled')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'canceled' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Canceled ({(requests.filter(r => r?.status === 'canceled') || []).length})
              </button>
            </div>
          </div>
        )}

        {/* Empty State or Requests List */}
        {!isLoggedIn ? (
          // Not logged in - show empty state
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FileText className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No Requests Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You need to be logged in to view your blood donation requests. 
              Please login or register to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Login to Continue
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : requests.length === 0 ? (
          // Logged in but no requests
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Heart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No Requests Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't created any blood donation requests yet. 
              Create your first request to get help from donors.
            </p>
            <Link
              to="/dashboard/create-request"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Create Your First Request
            </Link>
          </div>
        ) : filteredRequests.length === 0 ? (
          // Has requests but filtered results empty
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Filter className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No Matching Requests</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              No requests match your current filter. Try changing the filter or create a new request.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setFilterStatus('all')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Show All Requests
              </button>
              <Link
                to="/dashboard/create-request"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Create New Request
              </Link>
            </div>
          </div>
        ) : (
          // Show requests list
          <div className="space-y-6">
            {filteredRequests.map(request => (
              <div key={request._id || request.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-xl font-bold text-gray-800">
                            {request.recipientName || request.patientName || 'Recipient'}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                          {request.bloodGroup || 'Blood Group'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-gray-600 mt-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{request.hospitalName || 'Hospital'}</span>
                          {request.recipientDistrict && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{request.recipientDistrict}, {request.recipientUpazila}</span>
                            </>
                          )}
                        </div>
                        {request.donationDate && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{new Date(request.donationDate).toLocaleDateString()}</span>
                            {request.donationTime && (
                              <span className="ml-2">at {request.donationTime}</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Posted {formatDate(request.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={`font-medium ${
                          request.status === 'done' ? 'text-green-600' : 
                          request.status === 'canceled' ? 'text-red-600' : 
                          request.status === 'inprogress' ? 'text-blue-600' : 'text-yellow-600'
                        }`}>
                          {getStatusLabel(request.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Request Message */}
                  {request.requestMessage && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Request Message:</p>
                      <p className="text-gray-700">{request.requestMessage}</p>
                    </div>
                  )}

                  {/* Status Management Buttons */}
                  {request.status === 'inprogress' && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Manage Status:</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateRequestStatus(request._id, 'done')}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Mark as Completed
                        </button>
                        <button 
                          onClick={() => updateRequestStatus(request._id, 'canceled')}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <Link
                      to={`/dashboard/requests/${request._id}`}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                    <button 
                      onClick={() => navigate(`/dashboard/edit-request/${request._id}`)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Request
                    </button>
                    {request.status === 'pending' && (
                      <button 
                        onClick={() => updateRequestStatus(request._id, 'inprogress')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Start Donation
                      </button>
                    )}
                    <button 
                      onClick={() => deleteRequest(request._id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {isLoggedIn && (
          <div className="mt-8 text-center">
            <button
              onClick={fetchMyRequests}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {loading ? 'Refreshing...' : 'Refresh Requests'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;