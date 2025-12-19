import { useState, useEffect } from 'react';
import { donationAPI } from '../../../services/api'; 
import RequestCard from '../../../components/ui/cards/RequestCard';
import toast from 'react-hot-toast';
import { 
  FaFilter, 
  FaSearch, 
  FaDownload, 
  FaTint,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaHospital
} from 'react-icons/fa';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBloodGroup, setFilterBloodGroup] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const response = await donationAPI.getAllRequests();  // ✅ uppercase
      if (response.data.success) {
        setRequests(response.data.requests);
      } else {
        toast.error('Failed to fetch requests');
      }
    } catch (error) {
      toast.error('Error loading requests');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await donationAPI.updateStatus(requestId, newStatus);  // ✅ uppercase
      if (response.data.success) {
        toast.success(`Request ${newStatus} successfully`);
        fetchAllRequests(); // Refresh the list
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
      console.error('Error:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      const response = await donationAPI.deleteRequest(requestId);  // ✅ uppercase
      if (response.data.success) {
        toast.success('Request deleted successfully');
        fetchAllRequests();
      }
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.district?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;

    // Blood group filter
    const matchesBloodGroup = filterBloodGroup === 'all' || request.bloodGroup === filterBloodGroup;

    // Urgency filter
    const matchesUrgency = filterUrgency === 'all' || 
      (filterUrgency === 'urgent' && request.priority === 'high') ||
      (filterUrgency === 'normal' && request.priority !== 'high');

    return matchesSearch && matchesStatus && matchesBloodGroup && matchesUrgency;
  });

  // Get request statistics
  const requestStats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    urgent: requests.filter(r => r.priority === 'high').length
  };

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statuses = ['all', 'pending', 'approved', 'completed', 'rejected'];
  const urgencyLevels = ['all', 'urgent', 'normal'];

  const handleExportCSV = () => {
    toast.success('Exporting data to CSV...');
    // Implement CSV export logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">All Blood Requests</h1>
      <p className="text-gray-600 mb-8">Manage and monitor all blood donation requests</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="stat bg-base-100 rounded-lg p-4">
          <div className="stat-title">Total</div>
          <div className="stat-value">{requestStats.total}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg p-4">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-yellow-600">{requestStats.pending}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg p-4">
          <div className="stat-title">Approved</div>
          <div className="stat-value text-blue-600">{requestStats.appved}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg p-4">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-green-600">{requestStats.completed}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg p-4">
          <div className="stat-title">Rejected</div>
          <div className="stat-value text-red-600">{requestStats.rejected}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg p-4">
          <div className="stat-title">Urgent</div>
          <div className="stat-value text-orange-600">{requestStats.urgent}</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, hospital, or location..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div className="form-control">
              <select
                className="select select-bordered"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Group Filter */}
            <div className="form-control">
              <select
                className="select select-bordered"
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
              >
                {bloodGroups.map(group => (
                  <option key={group} value={group}>
                    {group === 'all' ? 'All Blood Groups' : group}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency Filter */}
            <div className="form-control">
              <select
                className="select select-bordered"
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
              >
                {urgencyLevels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterBloodGroup('all');
                setFilterUrgency('all');
              }}
            >
              <FaFilter className="mr-2" />
              Clear Filters
            </button>
            <button
              className="btn btn-success"
              onClick={handleExportCSV}
            >
              <FaDownload className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              showActions={true}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaTint className="text-4xl mx-auto mb-3 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2">No Requests Found</h2>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' || filterBloodGroup !== 'all' || filterUrgency !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No blood requests have been created yet'}
          </p>
        </div>
      )}

      {/* Results Info */}
      {filteredRequests.length > 0 && (
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <FaTint className="text-red-500" />
              <span>Blood Request</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-blue-500" />
              <span>Date Required</span>
            </div>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-green-500" />
              <span>Location</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRequests;