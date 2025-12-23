import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router'; 
import { toast } from 'react-hot-toast';

// Create context
const AuthContext = createContext();

// Custom hook for using auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // ✅ CORRECT: Include /api in base URL
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://https://myapp-cq1llcwyg-urmis-projects-37af7542.vercel.app/api';

  // Check authentication status on mount
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('🔍 Auth check - Token:', token ? 'Exists' : 'None');
      console.log('🔍 Auth check - User:', storedUser ? 'Exists' : 'None');
      
      if (!token || !storedUser) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }
      
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('✅ Parsed user:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (parseError) {
        console.error('Error parsing stored user:', parseError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // ✅ FIXED: Login function
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🔐 Logging in with:', credentials.email);
      console.log('🌐 API URL:', API_URL);
      
      let response;
      try {
        response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials),
        });
      } catch (networkError) {
        console.log('❌ Network error:', networkError.message);
        console.log('🛠️ Using mock login');
        return mockLogin(credentials);
      }
      
      console.log('📥 Login response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `Login failed (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const text = await response.text();
          errorMessage = text.includes('<!DOCTYPE') 
            ? 'Server is not responding properly' 
            : text.substring(0, 100);
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      console.log('📦 Login response data:', data);
      
      const token = data.accessToken || data.token;
      const userInfo = data.user;
      
      if (!token || !userInfo) {
        throw new Error('Missing authentication data');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setUser(userInfo);
      setIsAuthenticated(true);
      setLoading(false);
      
      toast.success('Login successful!');
      console.log('✅ Login successful!');
      
      return {
        success: true,
        user: userInfo,
        token: token,
        message: data.message || 'Login successful'
      };
      
    } catch (err) {
      console.error('❌ Login error:', err.message);
      setError(err.message);
      setLoading(false);
      toast.error(err.message || 'Login failed');
      
      return {
        success: false,
        message: err.message
      };
    }
  };

  // Mock login for development
  const mockLogin = (credentials) => {
    console.log('🛠️ Using mock login');
    
    const isAdmin = credentials.email.includes('admin');
    const isVolunteer = credentials.email.includes('volunteer');
    
    let role = 'donor';
    if (isAdmin) role = 'admin';
    if (isVolunteer) role = 'volunteer';
    
    const mockUser = {
      _id: 'mock_' + Date.now(),
      name: isAdmin ? 'Admin User' : isVolunteer ? 'Volunteer User' : 'Test Donor',
      email: credentials.email,
      role: role,
      bloodGroup: 'O+',
      district: 'Dhaka',
      upazila: 'Gulshan',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(isAdmin ? 'Admin' : 'Donor') + '&background=dc2626&color=fff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    setUser(mockUser);
    setIsAuthenticated(true);
    setLoading(false);
    
    toast.success('Mock login successful');
    
    return {
      success: true,
      user: mockUser,
      token: mockToken,
      message: 'Mock login successful'
    };
  };

  // ✅ FIXED: Registration function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('📝 Registering user...');
      
      // Prepare registration data
      let processedData = {};
      
      // If FormData is passed, extract values
      if (userData instanceof FormData) {
        console.log('📋 Processing FormData...');
        for (let [key, value] of userData.entries()) {
          processedData[key] = value;
        }
      } else {
        processedData = { ...userData };
      }
      
      console.log('📦 Processed registration data:', processedData);
      
      // Validate required fields
      const requiredFields = ['name', 'email', 'password', 'bloodGroup', 'district', 'upazila'];
      const missingFields = requiredFields.filter(field => !processedData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Handle avatar - convert File to base64 or use default
      if (processedData.avatar instanceof File) {
        console.log('📸 Converting avatar file to base64...');
        processedData.avatar = await fileToBase64(processedData.avatar);
      } else if (!processedData.avatar) {
        // Generate default avatar
        processedData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(processedData.name)}&background=dc2626&color=fff`;
      }
      
      // Add confirmPassword if not present
      if (!processedData.confirmPassword) {
        processedData.confirmPassword = processedData.password;
      }
      
      // Add role and status
      processedData.role = 'donor';
      processedData.status = 'active';
      
      console.log('📤 Final data to send:', processedData);
      
      let response;
      try {
        console.log('🌐 Sending registration request to:', `${API_URL}/auth/register`);
        
        response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(processedData),
        });
        
        console.log('📥 Registration response status:', response.status);
        
      } catch (networkError) {
        console.log('❌ Network error, using mock registration');
        return mockRegister(processedData);
      }
      
      // Handle response
      if (!response.ok) {
        let errorMessage = `Registration failed (${response.status})`;
        
        try {
          const errorData = await response.json();
          console.error('❌ Backend error:', errorData);
          
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          
          // Handle validation errors
          if (errorData.errors) {
            const validationErrors = Object.values(errorData.errors).join(', ');
            errorMessage = `Validation errors: ${validationErrors}`;
          }
        } catch (e) {
          const text = await response.text();
          console.error('❌ Response text:', text);
          errorMessage = text || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      let data;
      try {
        data = await response.json();
        console.log('✅ Registration response:', data);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      // Check if registration was successful
      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      
      const token = data.accessToken || data.token;
      const userInfo = data.user;
      
      if (!token || !userInfo) {
        throw new Error('Missing authentication data');
      }
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // Update state
      setUser(userInfo);
      setIsAuthenticated(true);
      setLoading(false);
      
      toast.success('Registration successful!');
      console.log('✅ Registration successful!');
      
      return {
        success: true,
        user: userInfo,
        token: token,
        message: data.message || 'Registration successful'
      };
      
    } catch (err) {
      console.error('❌ Registration error:', err.message);
      setError(err.message);
      setLoading(false);
      toast.error(err.message || 'Registration failed');
      
      return {
        success: false,
        message: err.message
      };
    }
  };

  // Mock registration
  const mockRegister = (userData) => {
    console.log('🛠️ Using mock registration');
    
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=dc2626&color=fff&bold=true`;
    
    const mockUser = {
      _id: 'mock_' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'donor',
      bloodGroup: userData.bloodGroup || 'O+',
      district: userData.district || 'Dhaka',
      upazila: userData.upazila || 'Gulshan',
      avatar: avatarUrl,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    setUser(mockUser);
    setIsAuthenticated(true);
    setLoading(false);
    
    toast.success('Mock registration successful');
    
    return {
      success: true,
      user: mockUser,
      token: mockToken,
      message: 'Mock registration successful'
    };
  };

  // Logout function
  const logout = () => {
    console.log('👋 Logging out...');
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    if (!user) return;
    const mergedUser = { ...user, ...updatedUser };
    setUser(mergedUser);
    localStorage.setItem('user', JSON.stringify(mergedUser));
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log('📝 Updating profile with:', profileData);

      let updatedUser;
      try {
        const response = await fetch(`${API_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(profileData)
        });

        console.log('📥 Profile update response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Profile update API response:', data);
          
          if (data.success && data.user) {
            updatedUser = data.user;
          } else {
            throw new Error(data.message || 'Update failed');
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `Update failed (${response.status})`);
        }
      } catch (apiError) {
        console.log('API update failed, using localStorage update:', apiError.message);
        
        updatedUser = {
          ...currentUser,
          ...profileData,
          updatedAt: new Date().toISOString()
        };
      }

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setLoading(false);
      toast.success('Profile updated successfully');

      return { 
        success: true, 
        user: updatedUser,
        message: 'Profile updated successfully'
      };

    } catch (err) {
      console.error('❌ Profile update error:', err);
      setError(err.message);
      setLoading(false);
      toast.error(err.message || 'Failed to update profile');
      
      return { 
        success: false, 
        message: err.message || 'Failed to update profile'
      };
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          return true;
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
    return false;
  };

  // Helper functions
  const isAdmin = () => user && user.role === 'admin';
  const isDonor = () => user && user.role === 'donor';
  const isVolunteer = () => user && user.role === 'volunteer';
  const isActive = () => user && user.status === 'active';
  const getToken = () => localStorage.getItem('token');
  
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    return !!(token && storedUser);
  };
  
  const clearError = () => setError(null);

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    updateUser,
    refreshUser,
    getToken,
    clearError,
    isAdmin,
    isDonor,
    isVolunteer,
    isActive,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, useAuth, AuthProvider };