// /pages/dashboard/donor/DonorHome.jsx - CORRECTED VERSION
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router';
import { Droplets, Calendar, MapPin, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DonorHome = () => {
  const { user } = useAuth();
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentRequests();
  }, []);

  const fetchRecentRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/requests/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Get MAXIMUM 3 recent requests
          const recent = (data.data || []).slice(0, 3);
          setRecentRequests(recent);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'inprogress': return 'text-blue-600 bg-blue-100';
      case 'done': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section - REQUIREMENTS: Welcome message with user's name */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">
          Thank you for being a blood donor hero! Here are your recent donation requests.
        </p>
      </div>

      {/* Recent Donation Requests - MAXIMUM 3 - REQUIREMENTS: Recent requests user created */}
      {recentRequests.length > 0 ? (
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Recent Donation Requests</h2>
              <Link 
                to="/dashboard/my-requests"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Requests →
              </Link>
            </div>
          </div>

          {/* Table - REQUIREMENTS: Tabular format with specific columns */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{request.recipientName}</div>
                      <div className="text-sm text-gray-500">{request.hospitalName}</div>
                    </td>
                    
                    {/* REQUIREMENTS: Location shows district and upazila */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{request.recipientDistrict}, {request.recipientUpazila}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(request.donationDate)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {request.donationTime}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-600 text-lg">
                        {request.bloodGroup}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    
                    {/* REQUIREMENTS: Edit, Delete, View buttons */}
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          title="Edit"
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete"
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          title="View Details"
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // If no requests created yet
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <Droplets className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No donation requests yet</h3>
          <p className="text-gray-600 mb-6">You haven't created any donation requests yet.</p>
          <Link
            to="/dashboard/create-request"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
          >
            Create Your First Request
          </Link>
        </div>
      )}
    </div>
  );
};

export default DonorHome;