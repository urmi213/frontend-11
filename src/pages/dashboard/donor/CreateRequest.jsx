import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

import { createRequest, getDistricts } from '../../../services/api';
import { 
  CalendarDays, 
  MapPin, 
  Hospital, 
  User, 
  MessageSquare,
  Clock,
  ArrowLeft,
  Mail
} from 'lucide-react';

const CreateRequest = () => {
  const { user } = useAuth();
 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: '',
    donationDate: '',
    donationTime: '',
    requestMessage: ''
  });
  
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const timeSlots = [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM'
  ];

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const districtsData = await getDistricts();
      setDistricts(districtsData.data || []);
    } catch (error) {
      console.error('Error loading districts:', error);
      showToast('Failed to load districts', 'error');
    }
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    const selectedDistrict = districts.find(d => d.id == districtId);
    
    setFormData({
      ...formData,
      recipientDistrict: selectedDistrict?.name || '',
      recipientUpazila: ''
    });
    
    if (selectedDistrict) {
      setUpazilas(selectedDistrict.upazilas || []);
    } else {
      setUpazilas([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }
    
    if (!formData.recipientDistrict) {
      newErrors.recipientDistrict = 'District is required';
    }
    
    if (!formData.recipientUpazila) {
      newErrors.recipientUpazila = 'Upazila is required';
    }
    
    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    }
    
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }
    
    if (!formData.donationDate) {
      newErrors.donationDate = 'Donation date is required';
    } else {
      const selectedDate = new Date(formData.donationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.donationDate = 'Date cannot be in the past';
      }
    }
    
    if (!formData.donationTime) {
      newErrors.donationTime = 'Time is required';
    }
    
    if (!formData.requestMessage.trim()) {
      newErrors.requestMessage = 'Request message is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      console.log('📤 Submitting request data:', formData);
      
      const result = await createRequest(formData);
      
      console.log('✅ Request created successfully:', result);
      
      if (result.success) {
        toast.success('✅ Blood donation request created successfully!');

        
        // Reset form
        setFormData({
          recipientName: '',
          recipientDistrict: '',
          recipientUpazila: '',
          hospitalName: '',
          fullAddress: '',
          bloodGroup: '',
          donationDate: '',
          donationTime: '',
          requestMessage: ''
        });
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
          navigate('/dashboard/my-donation-requests');
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to create request');
      }
      
    } catch (error) {
      console.error('❌ Error creating request:', error);
      
      let errorMessage = 'Failed to create request. Please try again.';
      
      if (error.response?.status === 403) {
        errorMessage = 'Your account is blocked. You cannot create donation requests.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid data. Please check all fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Create Blood Donation Request</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to request blood donation for your patient
          </p>
        </div>

        {/* User Info (Read Only) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Requester Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Requester Name
                </div>
              </label>
              <input
                type="text"
                value={user?.name || ''}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Requester Email
                </div>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Recipient Name *
                  </div>
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  className={`w-full px-4 py-3 border ${errors.recipientName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />
                {errors.recipientName && (
                  <p className="mt-1 text-sm text-red-600">{errors.recipientName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Hospital className="w-4 h-4" />
                    Blood Group *
                  </div>
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.bloodGroup ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    District *
                  </div>
                </label>
                <select
                  value={districts.find(d => d.name === formData.recipientDistrict)?.id || ''}
                  onChange={handleDistrictChange}
                  className={`w-full px-4 py-3 border ${errors.recipientDistrict ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.recipientDistrict && (
                  <p className="mt-1 text-sm text-red-600">{errors.recipientDistrict}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Upazila *
                  </div>
                </label>
                <select
                  name="recipientUpazila"
                  value={formData.recipientUpazila}
                  onChange={handleChange}
                  disabled={!formData.recipientDistrict}
                  className={`w-full px-4 py-3 border ${errors.recipientUpazila ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed`}
                >
                  <option value="">Select Upazila</option>
                  {upazilas.map(upazila => (
                    <option key={upazila.id} value={upazila.name}>
                      {upazila.name}
                    </option>
                  ))}
                </select>
                {errors.recipientUpazila && (
                  <p className="mt-1 text-sm text-red-600">{errors.recipientUpazila}</p>
                )}
              </div>
            </div>

            {/* Hospital Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Hospital className="w-4 h-4" />
                  Hospital Name *
                </div>
              </label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Example: Dhaka Medical College Hospital"
                className={`w-full px-4 py-3 border ${errors.hospitalName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              />
              {errors.hospitalName && (
                <p className="mt-1 text-sm text-red-600">{errors.hospitalName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address Line
              </label>
              <textarea
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="Example: Zahir Raihan Rd, Dhaka"
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Donation Date *
                  </div>
                </label>
                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border ${errors.donationDate ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />
                {errors.donationDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.donationDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Donation Time *
                  </div>
                </label>
                <select
                  name="donationTime"
                  value={formData.donationTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.donationTime ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                >
                  <option value="">Select Time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.donationTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.donationTime}</p>
                )}
              </div>
            </div>

            {/* Request Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Request Message (Details) *
                </div>
              </label>
              <textarea
                name="requestMessage"
                value={formData.requestMessage}
                onChange={handleChange}
                placeholder="Please write why you need blood in details. Include patient condition, hospital ward number, doctor name, contact information, etc."
                rows="4"
                className={`w-full px-4 py-3 border ${errors.requestMessage ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              />
              {errors.requestMessage && (
                <p className="mt-1 text-sm text-red-600">{errors.requestMessage}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Please provide detailed information about why blood is needed
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    Creating Request...
                  </div>
                ) : (
                  'Create Donation Request'
                )}
              </button>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                * Required fields. Status will be set to "Pending" by default.
              </p>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
              <span>Status will be automatically set to "Pending"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
              <span>Volunteers will review your request within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
              <span>Provide accurate hospital information for donor coordination</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
              <span>Detailed request message helps volunteers understand urgency</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;