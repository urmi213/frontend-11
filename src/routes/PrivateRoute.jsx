// routes/ProtectedRoute.jsx - COMPLETE FIXED VERSION
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router'; // ✅ Changed from 'react-router'
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, logout } = useAuth(); // ✅ Added logout
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Check authentication on component mount and when user changes
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        // No token found
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }

      if (token && storedUser) {
        try {
          // Parse user from localStorage
          const parsedUser = JSON.parse(storedUser);
          
          // Optional: Verify token with backend (if API is available)
          // try {
          //   const response = await fetch('http://https://myapp-cq1llcwyg-urmis-projects-37af7542.vercel.app/api/auth/verify', {
          //     headers: { 'Authorization': `Bearer ${token}` }
          //   });
          //   
          //   if (!response.ok) {
          //     throw new Error('Invalid token');
          //   }
          // } catch (error) {
          //   console.log('Token verification failed, using stored data');
          // }
          
          // Set authentication state
          setIsAuthenticated(true);
          
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          if (logout) logout();
        }
      } else if (token && !storedUser) {
        // Token exists but no user data - try to fetch user
        try {
          const response = await fetch('http://https://myapp-cq1llcwyg-urmis-projects-37af7542.vercel.app/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              localStorage.setItem('user', JSON.stringify(data.user));
              setIsAuthenticated(true);
            } else {
              throw new Error('Failed to fetch user');
            }
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          if (logout) logout();
        }
      }

      setAuthChecked(true);
    };

    checkAuthentication();
  }, [logout]);

  // ✅ Sync with AuthContext user state
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else if (authChecked && !user) {
      // If auth is checked and user is still null
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
      }
    }
  }, [user, authChecked]);

  // Show loading state while checking authentication
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    
    // Store the attempted URL for redirect after login
    const redirectPath = location.pathname + location.search;
    sessionStorage.setItem('redirectAfterLogin', redirectPath);
    
    // Redirect to appropriate login page
    if (adminOnly) {
      return <Navigate to="/login?admin=true" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required but user is not admin
  if (adminOnly) {
    const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
    
    if (currentUser.role !== 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">Administrator privileges required.</p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Current role: <span className="font-semibold capitalize">{currentUser.role || 'user'}</span>
              </p>
              <p className="text-sm text-gray-500">
                Required role: <span className="font-semibold">admin</span>
              </p>
              <a
                href="/dashboard"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Go to User Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;