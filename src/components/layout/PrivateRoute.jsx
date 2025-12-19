import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is blocked
  if (user.status === 'blocked') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Account Blocked</h2>
          <p className="text-gray-600">Your account has been blocked by admin. Please contact support.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;