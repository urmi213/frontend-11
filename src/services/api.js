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

// Response interceptor for token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
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
      
      // Clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION API ====================
export const authAPI = {
  // Login & Registration
  login: (credentials) => API.post('/auth/login', credentials).then(res => res.data),
  register: (userData) => API.post('/auth/register', userData).then(res => res.data),
  logout: () => API.post('/auth/logout').then(res => res.data),
  
  // User Management
  getMe: () => API.get('/auth/me').then(res => res.data),
  updateProfile: (userData) => API.put('/auth/profile', userData).then(res => res.data),
  
  // Token Management
  refreshToken: (refreshToken) => API.post('/auth/refresh', { refreshToken }).then(res => res.data),
  
  // Password Management
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }).then(res => res.data),
  resetPassword: (token, newPassword) => API.post('/auth/reset-password', { token, newPassword }).then(res => res.data),
};

// ==================== USER API ====================
export const userAPI = {
  // Search & List
  searchDonors: (params) => API.get('/users/search', { params }).then(res => res.data),
  getAllUsers: (params) => API.get('/users', { params }).then(res => res.data),
  getUser: (id) => API.get(`/users/${id}`).then(res => res.data),
  
  // CRUD Operations
  createUser: (userData) => API.post('/users', userData).then(res => res.data),
  updateUser: (id, data) => API.put(`/users/${id}`, data).then(res => res.data),
  deleteUser: (id) => API.delete(`/users/${id}`).then(res => res.data),
  
  // Status & Role Management
  updateUserStatus: (id, status) => API.patch(`/users/${id}/status`, { status }).then(res => res.data),
  updateUserRole: (id, role) => API.patch(`/users/${id}/role`, { role }).then(res => res.data),
  blockUser: (id) => API.patch(`/users/${id}/block`).then(res => res.data),
  unblockUser: (id) => API.patch(`/users/${id}/unblock`).then(res => res.data),
  
  // Stats
  getUserStats: () => API.get('/users/stats').then(res => res.data),
  getActiveDonors: () => API.get('/users/active-donors').then(res => res.data),
  
  // Profile
  uploadAvatar: (formData) => API.post('/users/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data),
};

// ==================== DONATION REQUESTS API ====================
export const donationAPI = {
  // Dashboard & Recent
  getDashboardData: () => API.get('/dashboard').then(res => res.data),
  getRecentRequests: (limit = 3) => API.get(`/donations/recent?limit=${limit}`).then(res => res.data),
  getMyRecentRequests: (limit = 3) => API.get(`/donations/my-recent?limit=${limit}`).then(res => res.data),
  getMyRequests: (params) => API.get('/donations/my-requests', { params }).then(res => res.data),
  
  // CRUD Operations
  createRequest: (data) => API.post('/donations', data).then(res => res.data),
  getAllRequests: (params) => API.get('/donations', { params }).then(res => res.data),
  getRequest: (id) => API.get(`/donations/${id}`).then(res => res.data),
  updateRequest: (id, data) => API.put(`/donations/${id}`, data).then(res => res.data),
  deleteRequest: (id) => API.delete(`/donations/${id}`).then(res => res.data),
  
  // Status Management
  updateStatus: (id, status) => API.patch(`/donations/${id}/status`, { status }).then(res => res.data),
  assignDonor: (id, donorId) => API.post(`/donations/${id}/assign-donor`, { donorId }).then(res => res.data),
  
  // Public Requests
  getPublicRequests: () => API.get('/donations/public').then(res => res.data),
  getRequestDetails: (id) => API.get(`/donations/${id}/details`).then(res => res.data),
  
  // Donor Actions
  respondToRequest: (id) => API.post(`/donations/${id}/respond`).then(res => res.data),
  
  // Stats & Analytics
  getDonationStats: () => API.get('/donations/stats').then(res => res.data),
  getAdminStats: () => API.get('/admin/donation-stats').then(res => res.data),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // Dashboard & Stats
  getAdminDashboard: () => API.get('/admin/dashboard').then(res => res.data),
  getAdminStats: () => API.get('/admin/stats').then(res => res.data),
  
  // User Management (Admin only)
  getAllUsersAdmin: (params) => API.get('/admin/users', { params }).then(res => res.data),
  updateUserAdmin: (id, data) => API.put(`/admin/users/${id}`, data).then(res => res.data),
  deleteUserAdmin: (id) => API.delete(`/admin/users/${id}`).then(res => res.data),
  
  // Donation Request Management (Admin only)
  getAllRequestsAdmin: (params) => API.get('/admin/requests', { params }).then(res => res.data),
  getRequestAdmin: (id) => API.get(`/admin/requests/${id}`).then(res => res.data),
  updateRequestAdmin: (id, data) => API.put(`/admin/requests/${id}`, data).then(res => res.data),
  deleteRequestAdmin: (id) => API.delete(`/admin/requests/${id}`).then(res => res.data),
  updateRequestStatusAdmin: (id, status) => API.patch(`/admin/requests/${id}/status`, { status }).then(res => res.data),
  
  // System Management
  getSystemStats: () => API.get('/admin/system-stats').then(res => res.data),
  getRecentActivities: () => API.get('/admin/recent-activities').then(res => res.data),
};

// ==================== PUBLIC DATA API ====================
export const publicAPI = {
  // Location Data (from Bangladesh GeoCode)
  getDivisions: () => API.get('/data/divisions').then(res => res.data),
  getDistricts: () => API.get('/data/districts').then(res => res.data),
  getUpazilas: (district) => API.get(`/data/upazilas/${district}`).then(res => res.data),
  getUnions: (upazila) => API.get(`/data/unions/${upazila}`).then(res => res.data),
  
  // Blood Groups
  getBloodGroups: () => API.get('/data/blood-groups').then(res => res.data),
  
  // Hospitals & Centers
  getHospitals: () => API.get('/data/hospitals').then(res => res.data),
  getDonationCenters: () => API.get('/data/donation-centers').then(res => res.data),
  
  // Static Data
  getFaqs: () => API.get('/data/faqs').then(res => res.data),
  getContactInfo: () => API.get('/data/contact').then(res => res.data),
};

// ==================== FUNDING API ====================
export const fundingAPI = {
  // Payment Processing
  createPaymentIntent: (amount) => API.post('/funding/create-intent', { amount }).then(res => res.data),
  confirmPayment: (paymentData) => API.post('/funding/confirm', paymentData).then(res => res.data),
  
  // Funding Management
  getMyFundings: () => API.get('/funding/my').then(res => res.data),
  getAllFundings: (params) => API.get('/funding', { params }).then(res => res.data),
  getFunding: (id) => API.get(`/funding/${id}`).then(res => res.data),
  createFunding: (data) => API.post('/funding', data).then(res => res.data),
  
  // Stats
  getFundingStats: () => API.get('/funding/stats').then(res => res.data),
  getTotalFunding: () => API.get('/funding/total').then(res => res.data),
  
  // Admin Functions
  getFundingsAdmin: (params) => API.get('/admin/fundings', { params }).then(res => res.data),
  updateFundingAdmin: (id, data) => API.put(`/admin/fundings/${id}`, data).then(res => res.data),
  deleteFundingAdmin: (id) => API.delete(`/admin/fundings/${id}`).then(res => res.data),
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = {
  // Role-based dashboard data
  getDashboardData: () => API.get('/dashboard').then(res => res.data),
  
  // Admin Dashboard
  getAdminDashboard: () => API.get('/dashboard/admin').then(res => res.data),
  
  // Donor Dashboard
  getDonorDashboard: () => API.get('/dashboard/donor').then(res => res.data),
  
  // Volunteer Dashboard
  getVolunteerDashboard: () => API.get('/dashboard/volunteer').then(res => res.data),
  
  // Common Dashboard Functions
  getDashboardStats: () => API.get('/dashboard/stats').then(res => res.data),
  getRecentActivities: () => API.get('/dashboard/activities').then(res => res.data),
  getNotifications: () => API.get('/dashboard/notifications').then(res => res.data),
};

// ==================== INDIVIDUAL EXPORTS (for direct imports) ====================

// ✅ Auth Functions
export const login = (credentials) => authAPI.login(credentials);
export const register = (userData) => authAPI.register(userData);
export const getMe = () => authAPI.getMe();
export const updateProfile = (userData) => authAPI.updateProfile(userData);

// ✅ User Functions
export const searchDonors = (params) => userAPI.searchDonors(params);
export const getAllUsers = (params) => userAPI.getAllUsers(params);
export const getUser = (id) => userAPI.getUser(id);
export const updateUser = (id, data) => userAPI.updateUser(id, data);
export const updateUserStatus = (id, status) => userAPI.updateUserStatus(id, status);
export const updateUserRole = (id, role) => userAPI.updateUserRole(id, role);

// ✅ Donation Request Functions
export const getDashboardData = () => dashboardAPI.getDashboardData();
export const getRecentRequests = (limit = 3) => donationAPI.getRecentRequests(limit);
export const getMyRecentRequests = (limit = 3) => donationAPI.getMyRecentRequests(limit);
export const getMyRequests = (params) => donationAPI.getMyRequests(params);
export const createRequest = (data) => donationAPI.createRequest(data);
export const getAllRequests = (params) => donationAPI.getAllRequests(params);
export const getRequest = (id) => donationAPI.getRequest(id);
export const updateRequest = (id, data) => donationAPI.updateRequest(id, data);
export const deleteRequest = (id) => donationAPI.deleteRequest(id);
export const updateRequestStatus = (id, status) => donationAPI.updateStatus(id, status);
export const getRequestDetails = (id) => donationAPI.getRequestDetails(id);
export const getPublicRequests = () => donationAPI.getPublicRequests();

// ✅ Admin Functions
export const getAdminDashboard = () => adminAPI.getAdminDashboard();
export const getAdminStats = () => adminAPI.getAdminStats();
export const getAllRequestsAdmin = (params) => adminAPI.getAllRequestsAdmin(params);
export const getRequestAdmin = (id) => adminAPI.getRequestAdmin(id);
export const updateRequestAdmin = (id, data) => adminAPI.updateRequestAdmin(id, data);
export const deleteRequestAdmin = (id) => adminAPI.deleteRequestAdmin(id);
export const updateRequestStatusAdmin = (id, status) => adminAPI.updateRequestStatusAdmin(id, status);
export const getAllUsersAdmin = (params) => adminAPI.getAllUsersAdmin(params);
export const updateUserAdmin = (id, data) => adminAPI.updateUserAdmin(id, data);
export const deleteUserAdmin = (id) => adminAPI.deleteUserAdmin(id);

// ✅ Public Data Functions
export const getDistricts = () => publicAPI.getDistricts();
export const getUpazilas = (district) => publicAPI.getUpazilas(district);
export const getBloodGroups = () => publicAPI.getBloodGroups();

// ✅ Funding Functions
export const createPaymentIntent = (amount) => fundingAPI.createPaymentIntent(amount);
export const confirmPayment = (paymentData) => fundingAPI.confirmPayment(paymentData);
export const getMyFundings = () => fundingAPI.getMyFundings();
export const getAllFundings = (params) => fundingAPI.getAllFundings(params);
export const getFundingStats = () => fundingAPI.getFundingStats();

// ==================== ALIAS EXPORTS (for backward compatibility) ====================
export const authApi = authAPI;
export const userApi = userAPI;
export const donationApi = donationAPI;
export const adminApi = adminAPI;
export const publicApi = publicAPI;
export const fundingApi = fundingAPI;
export const dashboardApi = dashboardAPI;

// ==================== DEFAULT EXPORT ====================
export default API;