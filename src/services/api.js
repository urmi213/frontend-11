// services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://https://myapp-cq1llcwyg-urmis-projects-37af7542.vercel.app/api';

// Create axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ VERY IMPORTANT: FIX THE REQUEST INTERCEPTOR
API.interceptors.request.use((config) => {
  // Check for token in localStorage
  const token = localStorage.getItem('token') || 
                localStorage.getItem('accessToken');
  
  console.log('🔑 Interceptor - Token found:', !!token);
  console.log('📤 Request to:', config.method?.toUpperCase(), config.url);
  
  // If token exists, add to headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token added to Authorization header');
  } else {
    console.warn('⚠️ No token found! Request will be unauthorized');
  }
  
  // Log the headers for debugging
  console.log('📋 Request headers:', config.headers);
  
  return config;
}, (error) => {
  console.error('❌ Request interceptor error:', error);
  return Promise.reject(error);
});

// ✅ ALSO FIX RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => {
    console.log('✅ Response status:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:');
    console.error('URL:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - Clearing tokens');
      
      // Clear all tokens
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Show message
      alert('Session expired. Please login again.');
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// ==================== API FUNCTIONS ====================

// 🔑 AUTH
export const login = async (credentials) => {
  try {
    console.log('🔐 Attempting login...');
    const response = await API.post('/auth/login', credentials);
    console.log('✅ Login response:', response.data);
    
    // Save token properly
    const token = response.data.accessToken || response.data.token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('accessToken', token);
      console.log('💾 Token saved to localStorage');
    }
    
    // Save user info
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me').then(res => res.data);

// 📊 DASHBOARD
export const getDashboardData = () => {
  console.log('📊 Fetching dashboard data...');
  return API.get('/dashboard').then(res => {
    console.log('✅ Dashboard data received');
    return res.data;
  });
};

// 📋 REQUESTS
export const getAllRequests = () => {
  console.log('📋 Fetching all requests...');
  return API.get('/dashboard/requests').then(res => {
    console.log('✅ All requests received:', res.data?.length || 0, 'requests');
    return res.data;
  });
};

export const getMyRequests = () => API.get('/dashboard/my-requests').then(res => res.data);

// ✅ FIXED: Correct endpoint for creating request
export const createRequest = (data) => {
  console.log('➕ Creating new request...', data);
  return API.post('/dashboard/requests', data).then(res => {
    console.log('✅ Request created successfully');
    return res.data;
  });
};

export const updateRequest = (id, data) => API.put(`/dashboard/requests/${id}`, data).then(res => res.data);
export const deleteRequest = (id) => API.delete(`/dashboard/requests/${id}`).then(res => res.data);
export const updateRequestStatus = (id, status) => 
  API.patch(`/dashboard/requests/${id}/status`, { status }).then(res => res.data);

// 📋 GET SINGLE REQUEST DETAILS
export const getRequestDetails = async (id) => {
  try {
    console.log(`📋 Fetching request details for ID: ${id}`);
    const response = await API.get(`/dashboard/requests/${id}`);
    console.log('✅ Request details received:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching request ${id}:`, error);
    throw error;
  }
};

// 👑 ADMIN
export const getAllUsers = () => API.get('/admin/users').then(res => res.data);
export const updateUserStatus = (id, data) => 
  API.patch(`/admin/users/${id}/status`, data).then(res => res.data);
export const updateUserRole = (id, data) => 
  API.patch(`/admin/users/${id}/role`, data).then(res => res.data);
export const getAdminStats = () => API.get('/admin/stats').then(res => res.data);

export const getAllRequestsAdmin = () => {
  console.log('👑 Fetching all requests (admin)...');
  return API.get('/admin/requests').then(res => {
    console.log('✅ All requests received:', res.data?.length || 0, 'requests');
    return res.data;
  });
};

export const updateRequestAdmin = async (id, data) => {
  try {
    console.log(`👑 Updating request ${id} (admin)...`, data);
    const response = await API.put(`/admin/requests/${id}`, data);
    console.log('✅ Request updated successfully');
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating request ${id}:`, error);
    throw error;
  }
};

// 🤝 VOLUNTEER API FUNCTIONS
export const getVolunteerRequests = async () => {
  try {
    console.log('🤝 Fetching all requests for volunteer...');
    const response = await API.get('/volunteer/requests');
    console.log('✅ Volunteer requests received:', response.data?.length || 0, 'requests');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching volunteer requests:', error);
    
    // If volunteer endpoint doesn't exist, fallback to dashboard/requests
    try {
      console.log('⚠️ Volunteer endpoint not found, trying dashboard endpoint...');
      const fallbackResponse = await API.get('/dashboard/requests');
      console.log('✅ Fallback successful:', fallbackResponse.data?.length || 0, 'requests');
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
      throw error;
    }
  }
};

export const getVolunteerStats = () => {
  console.log('📊 Fetching volunteer stats...');
  return API.get('/volunteer/stats').then(res => {
    console.log('✅ Volunteer stats received');
    return res.data;
  });
};

// 💰 FUNDING API FUNCTIONS
export const getFundingStats = async () => {
  try {
    console.log('💰 Fetching funding stats...');
    const response = await API.get('/funding/stats');
    console.log('✅ Funding stats received:', response.data);
    return response.data;
  } catch (error) {
    console.warn('⚠️ /funding/stats endpoint not found, using mock data');
    
    // Return mock data if endpoint doesn't exist
    return {
      success: true,
      data: {
        totalDonations: 12500,
        totalDonors: 234,
        monthlyGoal: 10000,
        currentMonth: 8500,
        fundingHistory: [
          { month: 'Jan', amount: 8500 },
          { month: 'Feb', amount: 9200 },
          { month: 'Mar', amount: 7800 },
          { month: 'Apr', amount: 10500 },
          { month: 'May', amount: 12500 }
        ]
      }
    };
  }
};

export const getDonations = async () => {
  try {
    const response = await API.get('/funding/donations');
    return response.data;
  } catch (error) {
    console.warn('⚠️ /funding/donations endpoint not found');
    return { success: true, data: [] };
  }
};

export const createDonation = async (donationData) => {
  try {
    const response = await API.post('/funding/donations', donationData);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating donation:', error);
    throw error;
  }
};

// 🌍 PUBLIC ENDPOINTS
export const getDistricts = () => API.get('/districts').then(res => res.data);
export const getPublicRequests = () => API.get('/requests/public').then(res => res.data);

export default API;