// src/services/api.js
import axios from 'axios';

// Vite environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token if refresh token exists
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_URL}/auth/refresh`,
            { refreshToken }
          );
          
          if (response.data.success) {
            localStorage.setItem('token', response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return API(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If refresh fails, logout user
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  updateProfile: (userData) => API.put('/users/profile', userData),
  logout: () => API.post('/auth/logout'),
};

// User API
export const userAPI = {
  searchDonors: (params) => API.get('/users/search', { params }),
  getAllUsers: (params) => API.get('/users', { params }),
  getUser: (id) => API.get(`/users/${id}`),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  getUserStats: () => API.get('/users/stats'),
};

// Donation API
export const donationAPI = {
  createRequest: (data) => API.post('/donations', data),
  getAllRequests: (params) => API.get('/donations', { params }),
  getPublicRequests: () => API.get('/donations/public'),
  getRequest: (id) => API.get(`/donations/${id}`),
  updateRequest: (id, data) => API.put(`/donations/${id}`, data),
  deleteRequest: (id) => API.delete(`/donations/${id}`),
  donateToRequest: (id) => API.post(`/donations/${id}/donate`),
  updateStatus: (id, status) => API.patch(`/donations/${id}/status`, { status }),
  getDonationStats: () => API.get('/donations/stats/all'),
};

// Public Data API
export const publicAPI = {
  getDistricts: () => API.get('/bangladesh/districts'),
  getUpazilas: (district) => API.get(`/bangladesh/upazilas/${district}`),
  getBloodGroups: () => API.get('/blood-groups'),
};

// Dashboard API
export const dashboardAPI = {
  getAdminStats: () => API.get('/dashboard/admin'),
  getDonorStats: () => API.get('/dashboard/donor'),
};

// Funding API
export const fundingAPI = {
  createPaymentIntent: (amount) => API.post('/funding/create-payment-intent', { amount }),
  confirmPayment: (data) => API.post('/funding/confirm-payment', data),
  getMyFundings: () => API.get('/funding/my-fundings'),
  getAllFundings: (params) => API.get('/funding', { params }),
  getFundingStats: () => API.get('/funding/stats/all'),
};

// Add lowercase aliases for compatibility
export const authApi = authAPI;
export const userApi = userAPI;
export const donationApi = donationAPI;
export const publicApi = publicAPI;
export const dashboardApi = dashboardAPI;
export const fundingApi = fundingAPI;
export const statsApi = {
  getAdminStats: dashboardAPI.getAdminStats,
  getDonorStats: dashboardAPI.getDonorStats,
};

export default API;