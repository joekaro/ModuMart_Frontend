// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const adminInfo = localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null;

  // ✅ Only allow access if adminInfo exists and isAdmin is true
  if (!adminInfo || !adminInfo.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminRoute;
