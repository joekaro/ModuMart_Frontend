import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();

  // Retrieve login info
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "null");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  // If this route is admin-only
  if (adminOnly) {
    if (!adminInfo || !adminInfo.token) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return children;
  }

  // Otherwise, this route is for a logged-in user
  if (!userInfo || !userInfo.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
