import { useEffect, useState } from "react";
import axios from "../utils/axios";

function AdminDashboard() {
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalEarnings: 0,
  });

 useEffect(() => {
  const fetchSummary = async () => {
    try {
      const { data } = await axios.get("/admin/summary");
      setSummary(data);
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    }
  };
  fetchSummary();
}, []);

  return (
    <div className="container-fluid">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body text-center text-md-start">
          <h3 className="fw-bold text-primary mb-2">Dashboard</h3>
          <p className="text-muted mb-0">
            Welcome to <strong>ModuMart Admin Dashboard</strong> — manage
            products, users, and orders easily.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="card text-center shadow-sm border-0 p-3 bg-light">
            <h6 className="text-secondary mb-1">Orders</h6>
            <h4 className="fw-bold text-primary">{summary.totalOrders}</h4>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card text-center shadow-sm border-0 p-3 bg-light">
            <h6 className="text-secondary mb-1">Users</h6>
            <h4 className="fw-bold text-success">{summary.totalUsers}</h4>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card text-center shadow-sm border-0 p-3 bg-light">
            <h6 className="text-secondary mb-1">Products</h6>
            <h4 className="fw-bold text-warning">{summary.totalProducts}</h4>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card text-center shadow-sm border-0 p-3 bg-light">
            <h6 className="text-secondary mb-1">Earnings</h6>
            <h4 className="fw-bold text-danger">
              ₦{summary.totalEarnings.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
