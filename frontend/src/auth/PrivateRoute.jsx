import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";


export default function PrivateRoute({ children, role }) {
  const { auth, hasRole } = useAuth();

  if (!auth?.token) return <Navigate to="/" replace />;

  if (role && !hasRole(role)) return <Navigate to="/" replace />;

  return children;
}
