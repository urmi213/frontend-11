// components/dashboard/AdminAllRequests.jsx - WITH PAGINATION FIX
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import { 
  Droplets, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Hospital,
  User,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAllRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchAllRequests();
  }, [user, navigate]);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, filterStatus]);

  const fetchAllRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRequests(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load donation requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    if (!requests || !Array.isArray(requests)) {
      setFilteredRequests([]);
      return;
    }
    
    let filtered = [...requests];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(req => 
        (req.recipientName && req.recipientName.toLowerCase().includes(term)) || 
        (req.hospitalName && req.hospitalName.toLowerCase().includes(term)) ||
        (req.requesterName && req.requesterName.toLowerCase().includes(term))
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(req => req.status === filterStatus);
    }
    
    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to first page when filtering
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
        fetchAllRequests();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
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
        fetchAllRequests();
      } else {
        toast.error(data.message || 'Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <span className="text-yellow-500">⏳</span>;
      case 'inprogress': return <span className="text-blue-500">🔄</span>;
      case 'done': return <span className="text-green-500">✅</span>;
      case 'cancelled': return <span className="text-red-500">❌</span>;
      default: return <span className="text-gray-500">📋</span>;
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ✅ FIXED: Check if filteredRequests exists
  const safeFilteredRequests = filteredRequests || [];
  
  // Calculate pagination - SAFE VERSION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safeFilteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(safeFilteredRequests.length / itemsPerPage);

  // ✅ SIMPLE PAGINATION COMPONENT
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
        >
          <ChevronLeft className="inline h-4 w-4" /> Prev
        </button>
        
        <div className="flex space-x-1">
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === number 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {number}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
        >
          Next <ChevronRight className="inline h-4 w-4" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <Droplets className="inline mr-2 h-8 w-8" />
            All Blood Donation Requests
          </h1>
          <p className="mt-2 text-gray-600">Manage all donation requests in the system</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-2" />
                Search Requests
              </label>
              <input
                type="text"
                placeholder="Search by recipient, hospital, or requester..."
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
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Summary
              </label>
              <div className="text-sm text-gray-600">
                Showing {safeFilteredRequests.length} of {requests.length} requests
                <div className="mt-1">
                  <p>Page {currentPage} of {totalPages}</p>
                  <p>Showing {currentItems.length} items per page</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        {currentItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <Droplets className="h-16 w-16 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No requests found</h3>
            <p className="mt-2 text-gray-600">
              {filterStatus === 'all' 
                ? "There are no donation requests in the system."
                : `No ${filterStatus} requests found.`
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((request) => (
                <div key={request._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Request Header */}
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{request.recipientName || 'Unknown'}</h3>
                        <div className="flex items-center mt-1 text-gray-600">
                          <Hospital className="h-4 w-4 mr-1" />
                          <span className="text-sm">{request.hospitalName || 'No hospital specified'}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)} {request.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Blood Group</p>
                        <p className="font-bold text-red-600 text-lg">{request.bloodGroup || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Requester</p>
                        <p className="font-medium text-gray-900 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {request.requesterName || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Request Details */}
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{formatDate(request.donationDate)} at {request.donationTime || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {request.recipientDistrict || 'N/A'}, {request.recipientUpazila || 'N/A'}
                        </span>
                      </div>
                      
                      {request.requestMessage && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 mb-1">Message:</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{request.requestMessage}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/dashboard/request/${request._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {request.status === 'inprogress' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(request._id, 'done')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Mark as Done"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(request._id, 'cancelled')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Cancel Request"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          {(request.status === 'pending' || request.status === 'inprogress') && (
                            <button
                              onClick={() => handleUpdateStatus(request._id, 'inprogress')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Mark as In Progress"
                            >
                              🔄
                            </button>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleDeleteRequest(request._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Request"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* ✅ Add Pagination */}
            <Pagination />
          </>
        )}
        
        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
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

export default AdminAllRequests;