import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute — Guards routes from unauthenticated access.
 * If adminOnly is true, only admin users can access the route.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
