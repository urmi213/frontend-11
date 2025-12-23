import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhotoIcon,
  MapPinIcon,
  HeartIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// District and Upazila data
const districts = [
  { id: 1, name: 'Dhaka' },
  { id: 2, name: 'Chittagong' },
  { id: 3, name: 'Rajshahi' },
  { id: 4, name: 'Khulna' },
  { id: 5, name: 'Barishal' },
  { id: 6, name: 'Sylhet' },
  { id: 7, name: 'Rangpur' },
  { id: 8, name: 'Mymensingh' },
  { id: 9, name: 'Comilla' },
  { id: 10, name: 'Noakhali' }
];

const upazilasByDistrict = {
  'Dhaka': ['Dhaka North', 'Dhaka South', 'Savar', 'Keraniganj', 'Narayanganj'],
  'Chittagong': ['Chittagong Sadar', 'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachhari'],
  'Rajshahi': ['Rajshahi Sadar', 'Natore', 'Naogaon', 'Chapainawabganj', 'Pabna'],
  'Khulna': ['Khulna Sadar', 'Jessore', 'Satkhira', 'Bagerhat', 'Narail'],
  'Barishal': ['Barishal Sadar', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokathi'],
  'Sylhet': ['Sylhet Sadar', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  'Rangpur': ['Rangpur Sadar', 'Dinajpur', 'Nilphamari', 'Gaibandha', 'Lalmonirhat'],
  'Mymensingh': ['Mymensingh Sadar', 'Jamalpur', 'Netrokona', 'Sherpur'],
  'Comilla': ['Comilla Sadar', 'Chandpur', 'Brahmanbaria', 'Lakshmipur'],
  'Noakhali': ['Noakhali Sadar', 'Feni', 'Lakshmipur', 'Chandpur']
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Generate avatar from name
const generateAvatarFromName = (name) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=dc2626&color=fff&bold=true&size=256`;
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    avatar: null
  });
  
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [upazilas, setUpazilas] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Update upazilas when district changes
  useEffect(() => {
    if (formData.district) {
      setUpazilas(upazilasByDistrict[formData.district] || []);
      setFormData(prev => ({ ...prev, upazila: '' }));
    } else {
      setUpazilas([]);
    }
  }, [formData.district]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, avatar: 'Please upload a valid image (JPEG, PNG, GIF)' }));
      return;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, avatar: 'Image size should be less than 2MB' }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setFormData(prev => ({ ...prev, avatar: file }));
    setErrors(prev => ({ ...prev, avatar: '' }));
  };

  // Upload image with fallback
  const uploadImage = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    
    // If no valid API key, use base64 fallback
    if (!apiKey || apiKey === 'your-api-key-here') {
      console.log('Using base64 fallback for avatar');
      return await fileToBase64(file);
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        console.warn('ImageBB failed, using fallback:', data.error);
        // Fallback to base64
        return await fileToBase64(file);
      }
    } catch (error) {
      console.error('Image upload failed, using fallback:', error);
      // Fallback to base64
      return await fileToBase64(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Blood group validation
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Please select your blood group';
    }

    // District validation
    if (!formData.district) {
      newErrors.district = 'Please select your district';
    }

    // Upazila validation
    if (!formData.upazila) {
      newErrors.upazila = 'Please select your upazila';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      let avatarUrl = '';
      
      // Handle avatar
      if (formData.avatar) {
        setUploadingAvatar(true);
        avatarUrl = await uploadImage(formData.avatar);
        setUploadingAvatar(false);
      } else if (formData.name) {
        // Generate avatar from name if no image uploaded
        avatarUrl = generateAvatarFromName(formData.name);
      }

      // Prepare user data
      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
        avatar: avatarUrl,
        role: 'donor',
        status: 'active'
      };

      // Register user
      await register(userData);
      
      toast.success('Registration successful! Welcome to BloodLink');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (errorMessage.includes('email already exists')) {
          setErrors(prev => ({ ...prev, email: 'Email already registered' }));
        }
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <HeartIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Blood<span className="text-red-600">Link</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Our Life-Saving Community
          </h1>
          <p className="text-gray-600">
            Register as a blood donor and help save lives in your community
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side */}
            <div className="md:w-2/5 bg-gradient-to-br from-red-600 to-red-700 text-white p-8 md:p-12">
              <div className="h-full flex flex-col justify-center">
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-300" />
                    <h3 className="font-bold">Important Notes</h3>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <p className="text-red-100">
                      • Profile picture is optional. You can skip it.
                    </p>
                    <p className="text-red-100">
                      • Your information is secure and private.
                    </p>
                    <p className="text-red-100">
                      • By default, you'll be registered as a "donor".
                    </p>
                    <p className="text-red-100">
                      • Your account status will be "active" by default.
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <p className="text-sm text-red-100 mb-4">
                    Already have an account?
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center w-full py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Sign In Here
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-3/5 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                        Full Name *
                      </div>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                        Email Address *
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <LockClosedIcon className="w-4 h-4 mr-2 text-gray-500" />
                        Password *
                      </div>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition`}
                      placeholder="At least 6 characters"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <LockClosedIcon className="w-4 h-4 mr-2 text-gray-500" />
                        Confirm Password *
                      </div>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {bloodGroups.map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, bloodGroup: group }));
                          if (errors.bloodGroup) {
                            setErrors(prev => ({ ...prev, bloodGroup: '' }));
                          }
                        }}
                        className={`py-3 rounded-lg font-bold transition-all ${formData.bloodGroup === group ? 'bg-red-600 text-white shadow-lg' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                  {errors.bloodGroup && (
                    <p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>
                  )}
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white`}
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upazila *
                    </label>
                    <select
                      name="upazila"
                      value={formData.upazila}
                      onChange={handleInputChange}
                      disabled={!formData.district}
                      className={`w-full px-4 py-3 border ${errors.upazila ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white ${!formData.district ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map((upazila, index) => (
                        <option key={index} value={upazila}>
                          {upazila}
                        </option>
                      ))}
                    </select>
                    {errors.upazila && (
                      <p className="mt-1 text-sm text-red-600">{errors.upazila}</p>
                    )}
                  </div>
                </div>

                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <PhotoIcon className="w-4 h-4 mr-2 text-gray-500" />
                      Profile Picture (Optional)
                    </div>
                  </label>
                  
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-gray-100">
                        {avatarPreview ? (
                          <img 
                            src={avatarPreview} 
                            alt="Avatar preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <PhotoIcon className="w-10 h-10 mb-2" />
                            <span className="text-xs">No photo</span>
                          </div>
                        )}
                      </div>
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="space-y-2">
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                            id="avatar-upload"
                          />
                          <div className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="text-center">
                              <div className="text-sm text-gray-600">
                                {formData.avatar ? 'Change Photo' : 'Upload Photo'}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                JPG, PNG, GIF (Max 2MB)
                              </div>
                            </div>
                          </div>
                        </label>
                        
                        {formData.avatar && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, avatar: null }));
                              setAvatarPreview('');
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove photo
                          </button>
                        )}
                      </div>
                      
                      {errors.avatar && (
                        <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="pt-4">
                  <div className="flex items-start mb-6">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-red-600 hover:text-red-700 font-medium">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-red-600 hover:text-red-700 font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || uploadingAvatar}
                    className="w-full flex items-center justify-center px-6 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Creating Account...
                      </>
                    ) : uploadingAvatar ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Uploading Image...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Registration Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  • By default, all users are registered as <span className="font-semibold">"donors"</span>
                </p>
                <p>
                  • Your account status will be <span className="font-semibold">"active"</span> by default
                </p>
                <p>
                  • Profile picture upload is optional - you can skip it
                </p>
                <p className="mt-2 text-xs">
                  Note: Admin can change your role or status later if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;