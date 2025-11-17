import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { auth, hasRole } = useAuth();

  // Check if user is authenticated
  if (!auth || !auth.token) {
    return <Navigate to="/login" />;
  }

  // Check if user has required role
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default PrivateRoute;