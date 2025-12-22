// pages/dashboard/RequestDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Hospital,
  Droplet,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Share2,
  Printer,
  Download,
  Heart,
  Shield,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import LoadingSpinner from '../../../pages/dashboard/shared/Loader';
import DonateModal from '../../../pages/dashboard/shared/DonateModal';
import ConfirmModal from '../../../components/ui/modals/ConfirmationModal';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Blood group colors
  const bloodGroupColors = {
    'A+': 'bg-red-100 text-red-800 border-red-300',
    'A-': 'bg-red-50 text-red-700 border-red-200',
    'B+': 'bg-blue-100 text-blue-800 border-blue-300',
    'B-': 'bg-blue-50 text-blue-700 border-blue-200',
    'AB+': 'bg-purple-100 text-purple-800 border-purple-300',
    'AB-': 'bg-purple-50 text-purple-700 border-purple-200',
    'O+': 'bg-green-100 text-green-800 border-green-300',
    'O-': 'bg-green-50 text-green-700 border-green-200'
  };

  // Status colors and icons
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <AlertCircle className="h-5 w-5" />,
      label: 'Pending'
    },
    inprogress: {
      color: 'bg-blue-100 text-blue-800',
      icon: <Clock className="h-5 w-5" />,
      label: 'In Progress'
    },
    done: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-5 w-5" />,
      label: 'Completed'
    },
    canceled: {
      color: 'bg-red-100 text-red-800',
      icon: <XCircle className="h-5 w-5" />,
      label: 'Cancelled'
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/requests/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setRequest(response.data.request);
        
        // If request has donor, fetch donor details
        if (response.data.request.donorId) {
          fetchDonorDetails(response.data.request.donorId);
        }
        
        // Fetch other potential donors for this request
        if (response.data.request.status === 'pending') {
          fetchPotentialDonors();
        }
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonorDetails = async (donorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${donorId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setDonors([response.data.user]);
      }
    } catch (error) {
      console.error('Error fetching donor details:', error);
    }
  };

  const fetchPotentialDonors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/requests/${id}/potential-donors`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setDonors(response.data.donors);
      }
    } catch (error) {
      console.error('Error fetching potential donors:', error);
    }
  };

  const handleDonate = async () => {
    setShowDonateModal(true);
  };

  const handleDonationConfirm = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/requests/${id}/donate`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Thank you for donating! Status updated to In Progress');
        fetchRequestDetails();
        setShowDonateModal(false);
      }
    } catch (error) {
      console.error('Error donating:', error);
      toast.error(error.response?.data?.message || 'Failed to process donation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/requests/${id}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchRequestDetails();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/requests/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Request deleted successfully');
        navigate('/dashboard/my-donation-requests');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/requests/${id}`;
    if (navigator.share) {
      navigator.share({
        title: `Blood Donation Request - ${request?.recipientName}`,
        text: `Help needed! Blood donation request for ${request?.bloodGroup} in ${request?.recipientDistrict}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Not Found</h2>
          <p className="text-gray-600 mb-6">The requested blood donation request could not be found.</p>
          <Link
            to="/dashboard/my-donation-requests"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Requests
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[request.status] || statusConfig.pending;
  const isRequester = request.requesterId === JSON.parse(localStorage.getItem('user'))._id;
  const canDonate = request.status === 'pending' && !isRequester;
  const canEdit = request.status === 'pending' && isRequester;
  const canDelete = (request.status === 'pending' || request.status === 'canceled') && isRequester;
  const canChangeStatus = request.status === 'inprogress' && (isRequester || request.donorId === JSON.parse(localStorage.getItem('user'))._id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/dashboard/my-donation-requests"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Requests
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center flex-wrap gap-3 mb-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Blood Donation Request
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${status.color}`}>
                      {status.icon}
                      <span className="ml-1">{status.label}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${bloodGroupColors[request.bloodGroup]}`}>
                      <Droplet className="inline mr-1 h-4 w-4" />
                      {request.bloodGroup}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Request ID: <span className="font-mono text-gray-800">{request._id}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                    title="Print"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  
                  {canEdit && (
                    <Link
                      to={`/dashboard/edit-request/${id}`}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Request"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                  )}
                  
                  {canDelete && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                      title="Delete Request"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Request Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b">📋 Request Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recipient Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5 text-blue-500" />
                    Recipient Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Recipient Name</label>
                      <p className="font-medium text-gray-900">{request.recipientName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Hospital</label>
                      <p className="font-medium text-gray-900 flex items-center">
                        <Hospital className="mr-2 h-4 w-4 text-red-500" />
                        {request.hospitalName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-green-500" />
                    Location Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">District & Upazila</label>
                      <p className="font-medium text-gray-900">
                        {request.recipientDistrict}, {request.recipientUpazila}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Full Address</label>
                      <p className="font-medium text-gray-900">{request.fullAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Donation Schedule */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                    Donation Schedule
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Donation Date</label>
                      <p className="font-medium text-gray-900">
                        {new Date(request.donationDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Donation Time</label>
                      <p className="font-medium text-gray-900 flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-orange-500" />
                        {request.donationTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blood Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <Droplet className="mr-2 h-5 w-5 text-red-500" />
                    Blood Requirements
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Required Blood Group</label>
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg font-bold ${bloodGroupColors[request.bloodGroup]}`}>
                        <Droplet className="mr-2 h-5 w-5" />
                        {request.bloodGroup}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Urgency Level</label>
                      <p className="font-medium text-gray-900">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          request.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                          request.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.urgency === 'critical' ? 'Critical ⚠️' :
                           request.urgency === 'high' ? 'High 🚨' : 'Normal'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Message */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">📝 Request Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{request.requestMessage}</p>
                </div>
              </div>
            </div>

            {/* Donor Information (if available) */}
            {request.donorId && request.donorDetails && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b flex items-center">
                  <Users className="mr-2 h-5 w-5 text-green-500" />
                  Donor Information
                </h2>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={request.donorDetails.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.donorDetails.name)}&background=4CAF50&color=fff`}
                        alt={request.donorDetails.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{request.donorDetails.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-1" />
                          <span className="text-sm">{request.donorDetails.email}</span>
                        </div>
                        {request.donorDetails.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-1" />
                            <span className="text-sm">{request.donorDetails.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <Droplet className="h-4 w-4 mr-1" />
                          <span className="text-sm">{request.donorDetails.bloodGroup}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-green-600">
                        <CheckCircle className="inline h-4 w-4 mr-1" />
                        Donor has accepted to donate blood
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-wrap gap-4 justify-center">
                {canDonate && (
                  <button
                    onClick={handleDonate}
                    disabled={actionLoading}
                    className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold flex items-center text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    {actionLoading ? 'Processing...' : 'I Want to Donate 🩸'}
                  </button>
                )}

                {canChangeStatus && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateStatus('done')}
                      disabled={actionLoading}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium flex items-center disabled:opacity-50"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('canceled')}
                      disabled={actionLoading}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium flex items-center disabled:opacity-50"
                    >
                      <XCircle className="mr-2 h-5 w-5" />
                      Cancel Donation
                    </button>
                  </div>
                )}

                {request.status === 'done' && (
                  <div className="text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-lg">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span className="font-semibold">Donation Completed Successfully! 🎉</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Thank you for participating in this life-saving mission
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Requester Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-500" />
                Requester Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      src={request.requesterDetails?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.requesterName)}&background=3B82F6&color=fff`}
                      alt={request.requesterName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.requesterName}</h4>
                    <p className="text-sm text-gray-600">{request.requesterEmail}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Status: 
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${status.color}`}>
                        {status.label}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
              <h3 className="text-lg font-bold mb-4">📊 Request Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm opacity-90">Time Remaining</p>
                  <p className="text-2xl font-bold">
                    {new Date(request.donationDate) > new Date() ? 
                      `${Math.ceil((new Date(request.donationDate) - new Date()) / (1000 * 60 * 60 * 24))} days` : 
                      'Today'}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Potential Donors</p>
                  <p className="text-2xl font-bold">{donors.length}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Views</p>
                  <p className="text-2xl font-bold">{request.views || 0}</p>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📤 Share This Request</h3>
              <div className="space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium flex items-center justify-center"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share with Friends
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center"
                >
                  <Printer className="mr-2 h-5 w-5" />
                  Print Details
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-full px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition font-medium flex items-center justify-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DonateModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        onConfirm={handleDonationConfirm}
        loading={actionLoading}
        request={request}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteRequest}
        title="Delete Request"
        message="Are you sure you want to delete this donation request? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        loading={actionLoading}
      />
    </div>
  );
};

export default RequestDetails;