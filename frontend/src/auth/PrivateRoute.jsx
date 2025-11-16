import React from 'react';
import { Navigate } from 'react-router-dom';
import { authProvider } from './authProvider';

const PrivateRoute = ({ children, roles }) => {
  const isAuth = authProvider.isAuthenticated();
  const user = authProvider.getCurrentUser();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some(role => authProvider.hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default PrivateRoute;
