import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const API_URL = 'http://localhost:5000';

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Error parsing user:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // ✅ FIXED LOGIN FUNCTION - SIMPLIFIED
  const login = async (credentials) => {
    try {
      setError(null);
      
      console.log('🔐 Attempting login with:', credentials.email);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('📦 Server response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ CORRECT: accessToken থেকে token নিন
      const token = data.accessToken;
      const userInfo = data.user;
      
      if (!token) {
        console.error('❌ No token in response. Full response:', data);
        throw new Error('No authentication token received');
      }
      
      if (!userInfo) {
        console.error('❌ No user data in response');
        throw new Error('No user data received');
      }

      // Save to localStorage and state
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      console.log('✅ Login successful!');
      console.log('👤 User:', userInfo.email);
      console.log('🔑 Token saved:', token.substring(0, 20) + '...');
      
      return { 
        success: true, 
        user: userInfo,
        token: token,
        message: data.message || 'Login successful'
      };
      
    } catch (err) {
      console.error('❌ Login error:', err.message);
      setError(err.message);
      
      return { 
        success: false, 
        message: err.message 
      };
    }
  };

  // ✅ FIXED REGISTER FUNCTION
  const register = async (userData) => {
    try {
      setError(null);
      
      console.log('📝 Registering user:', userData.email);
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('📦 Registration response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const token = data.accessToken;
      const userInfo = data.user;
      
      if (!token) {
        throw new Error('No authentication token received');
      }

      // Save to localStorage and state
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      console.log('✅ Registration successful!');
      
      return { 
        success: true, 
        user: userInfo,
        token: token,
        message: data.message || 'Registration successful'
      };
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err.message);
      return { 
        success: false, 
        message: err.message 
      };
    }
  };

  // Logout function
  const logout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setUser,
    setError,
    isAuthenticated: !!user && !!localStorage.getItem('token')
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;