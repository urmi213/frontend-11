import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const CreateRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Bangladeshi districts and upazilas data
  const bangladeshData = {
    districts: [
      'Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 
      'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Noakhali'
    ],
    districtUpazilas: {
      'Dhaka': ['Gulshan', 'Mirpur', 'Dhanmondi', 'Uttara', 'Motijheel', 'Savar'],
      'Chittagong': ['Agrabad', 'Panchlaish', 'Kotwali', 'Double Mooring', 'Hathazari'],
      'Sylhet': ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Jaintiapur'],
      'Khulna': ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur'],
      'Rajshahi': ['Rajshahi Sadar', 'Boalia', 'Motihar', 'Shah Makhdum'],
      'Barisal': ['Barisal Sadar', 'Babuganj', 'Bakerganj', 'Banaripara'],
      'Rangpur': ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia'],
      'Mymensingh': ['Mymensingh Sadar', 'Trishal', 'Bhaluka', 'Fulbaria'],
      'Comilla': ['Comilla Sadar', 'Chandina', 'Daudkandi', 'Homna'],
      'Noakhali': ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Senbagh']
    }
  };

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: 'A+',
    donationDate: '',
    donationTime: '10:00 AM',
    requestMessage: ''
  });

  const [loading, setLoading] = useState(false);
  const [districts] = useState(bangladeshData.districts);
  const [upazilas, setUpazilas] = useState([]);

  // Set user info and default district if user has one
  useEffect(() => {
    if (user) {
      if (user.district && bangladeshData.districts.includes(user.district)) {
        setFormData(prev => ({
          ...prev,
          recipientDistrict: user.district,
          recipientUpazila: user.upazila || ''
        }));
        
        const districtUpazilas = bangladeshData.districtUpazilas[user.district] || [];
        setUpazilas(districtUpazilas);
      }
    }
  }, [user]);

  // Update upazilas when district changes
  useEffect(() => {
    if (formData.recipientDistrict) {
      const districtUpazilas = bangladeshData.districtUpazilas[formData.recipientDistrict] || [];
      setUpazilas(districtUpazilas);
      
      if (!districtUpazilas.includes(formData.recipientUpazila)) {
        setFormData(prev => ({
          ...prev,
          recipientUpazila: districtUpazilas[0] || ''
        }));
      }
    } else {
      setUpazilas([]);
    }
  }, [formData.recipientDistrict]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.recipientName.trim()) {
      toast.error('Please enter recipient name');
      return;
    }
    
    if (!formData.recipientDistrict) {
      toast.error('Please select district');
      return;
    }
    
    if (!formData.recipientUpazila) {
      toast.error('Please select upazila');
      return;
    }
    
    if (!formData.hospitalName.trim()) {
      toast.error('Please enter hospital name');
      return;
    }
    
    if (!formData.bloodGroup) {
      toast.error('Please select blood group');
      return;
    }
    
    if (!formData.donationDate) {
      toast.error('Please select donation date');
      return;
    }
    
    if (!formData.donationTime) {
      toast.error('Please select donation time');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientName: formData.recipientName,
          recipientDistrict: formData.recipientDistrict,
          recipientUpazila: formData.recipientUpazila,
          hospitalName: formData.hospitalName,
          fullAddress: formData.fullAddress,
          bloodGroup: formData.bloodGroup,
          donationDate: formData.donationDate,
          donationTime: formData.donationTime,
          requestMessage: formData.requestMessage
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Donation request created successfully!');
        navigate('/dashboard/my-requests');
      } else {
        toast.error(data.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      
      if (error.message.includes('Unexpected token') || error.message.includes('non-JSON')) {
        toast.error('Server error. Please check if backend is running on port 5000');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Get tomorrow's date for min date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">🩸 Create Donation Request</h1>
            <p className="mt-2 text-gray-600">Request blood donation for someone in need</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requester Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requester Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Recipient Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipient Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="Enter recipient's full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <select
                  name="recipientDistrict"
                  value={formData.recipientDistrict}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upazila *
                </label>
                <select
                  name="recipientUpazila"
                  value={formData.recipientUpazila}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.recipientDistrict}
                >
                  <option value="">Select Upazila</option>
                  {upazilas.map(upazila => (
                    <option key={upazila} value={upazila}>{upazila}</option>
                  ))}
                </select>
                {!formData.recipientDistrict && (
                  <p className="text-sm text-gray-500 mt-1">Please select a district first</p>
                )}
              </div>
            </div>

            {/* Hospital Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Name *
              </label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="e.g., Dhaka Medical College Hospital"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              <textarea
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="Full hospital address with road details"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Date *
                </label>
                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleChange}
                  min={getTomorrowDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Time *
                </label>
                <select
                  name="donationTime"
                  value={formData.donationTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>

            {/* Request Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Message (Optional)
              </label>
              <textarea
                name="requestMessage"
                value={formData.requestMessage}
                onChange={handleChange}
                placeholder="Briefly explain why blood is needed..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                This message will be visible to potential donors
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Request...
                  </span>
                ) : 'Create Donation Request'}
              </button>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                * Required fields
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;