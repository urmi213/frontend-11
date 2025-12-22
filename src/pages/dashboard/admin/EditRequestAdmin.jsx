import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  getRequestDetails, 
  updateRequestAdmin 
} from '../../../services/api';

const EditRequestAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: '',
    donationDate: '',
    donationTime: '',
    requestMessage: '',
    status: 'pending',
    assignedDonor: {
      name: '',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    if (id) {
      fetchRequestData();
    }
  }, [id]);

  const fetchRequestData = async () => {
    try {
      setLoading(true);
      const response = await getRequestDetails(id);
      
      // ✅ API response check - handle different response structures
      let requestData;
      if (response.data) {
        // If response has data property
        requestData = response.data;
      } else if (response.request) {
        // If response is the request object itself
        requestData = response;
      } else {
        // Fallback
        requestData = response;
      }

      console.log('Fetched request data:', requestData); // Debug log

      setFormData({
        recipientName: requestData.recipientName || '',
        recipientDistrict: requestData.recipientDistrict || requestData.district || '',
        recipientUpazila: requestData.recipientUpazila || requestData.upazila || '',
        hospitalName: requestData.hospitalName || '',
        fullAddress: requestData.fullAddress || '',
        bloodGroup: requestData.bloodGroup || '',
        donationDate: requestData.donationDate 
          ? new Date(requestData.donationDate).toISOString().split('T')[0]
          : '',
        donationTime: requestData.donationTime || '',
        requestMessage: requestData.requestMessage || '',
        status: requestData.status || 'pending',
        assignedDonor: requestData.assignedDonor || requestData.donor || {
          name: '',
          email: '',
          phone: ''
        }
      });
    } catch (err) {
      console.error('Error fetching request:', err);
      alert('Failed to load request data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignedDonorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      assignedDonor: {
        ...prev.assignedDonor,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.recipientName || !formData.bloodGroup || !formData.donationDate || !formData.donationTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      // Prepare data for API
      const updateData = {
        recipientName: formData.recipientName,
        recipientDistrict: formData.recipientDistrict,
        recipientUpazila: formData.recipientUpazila,
        district: formData.recipientDistrict,
        upazila: formData.recipientUpazila,
        hospitalName: formData.hospitalName,
        fullAddress: formData.fullAddress,
        bloodGroup: formData.bloodGroup,
        donationDate: formData.donationDate,
        donationTime: formData.donationTime,
        requestMessage: formData.requestMessage,
        status: formData.status,
      };

      // Add assigned donor only if status is inprogress and donor info exists
      if (formData.status === 'inprogress' && 
          (formData.assignedDonor.name || formData.assignedDonor.email)) {
        updateData.assignedDonor = formData.assignedDonor;
        updateData.donor = formData.assignedDonor;
      }

      console.log('Sending update data:', updateData); // Debug log
      
      await updateRequestAdmin(id, updateData);
      alert('✅ Request updated successfully!');
      navigate('/dashboard/all-blood-donation-request');
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      alert(`❌ Failed to update request: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Donation Request</h1>
          <p className="text-gray-600 mt-2">Update donation request details (Admin Mode)</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/all-blood-donation-request')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back to All Requests
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Recipient Information */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Recipient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="Enter recipient's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipientDistrict"
                    value={formData.recipientDistrict}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="e.g., Dhaka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upazila <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipientUpazila"
                    value={formData.recipientUpazila}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="e.g., Dhanmondi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="e.g., Dhaka Medical College Hospital"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Street address, area"
                  />
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Donation Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="donationDate"
                    value={formatDateForInput(formData.donationDate)}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="donationTime"
                    value={formData.donationTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="inprogress">🔄 In Progress</option>
                    <option value="done">✅ Completed</option>
                    <option value="canceled">❌ Canceled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Assigned Donor (Conditional) */}
            {formData.status === 'inprogress' && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Assigned Donor Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donor Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.assignedDonor.name}
                      onChange={handleAssignedDonorChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Donor's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donor Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.assignedDonor.email}
                      onChange={handleAssignedDonorChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="donor@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donor Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.assignedDonor.phone}
                      onChange={handleAssignedDonorChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="+8801XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Request Message */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Request Message
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why blood is needed? (Details)
                </label>
                <textarea
                  name="requestMessage"
                  value={formData.requestMessage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[150px]"
                  placeholder="Please explain why you need blood, medical condition, urgency, etc..."
                  rows={4}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard/all-blood-donation-request')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    Updating...
                  </>
                ) : (
                  'Update Donation Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Debug Info (Remove in production) */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info (Request ID: {id})</h3>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default EditRequestAdmin;