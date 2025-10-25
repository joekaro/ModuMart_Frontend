// src/components/AdminSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Plus,
  Users,
  ShoppingBag,
  LogOut,
  BarChart3
} from "lucide-react";

/**
 * Props:
 * - isSidebarOpen (bool)
 * - toggleSidebar (fn)
 * - closeSidebar (fn)
 */
export default function AdminSidebar({ isSidebarOpen, toggleSidebar, closeSidebar }) {
  const navigate = useNavigate();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { to: "/admin/products", label: "Products", icon: <Package size={16} /> },
    { to: "/admin/add-product", label: "Add Product", icon: <Plus size={16} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={16} /> },
    { to: "/admin/orders", label: "Orders", icon: <ShoppingBag size={16} /> },
    { to: "/admin/earnings", label: "Analytics", icon: <BarChart3 size={16} /> },
  ];

  const handleLogout = () => {
    // keep your logout logic here
    localStorage.removeItem("adminInfo");
    delete window.axios?.defaults?.headers?.common?.Authorization;
    navigate("/admin/login");
    if (window.innerWidth < 992 && closeSidebar) closeSidebar();
  };

  // sidebar style: on large screens it's fixed-left; on small screens it slides in/out
  return (
    <aside
      className="admin-sidebar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: 240,
        zIndex: 1050,
        background: "#111827", // dark
        color: "#fff",
        boxShadow: "0 0 12px rgba(0,0,0,0.12)",
        transform:
          isSidebarOpen || window.innerWidth >= 992 ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease-in-out",
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <h5 className="fw-bold mb-0 text-white">ModuMart Admin</h5>
        {/* show close button on mobile */}
        {window.innerWidth < 992 && (
          <button className="btn btn-outline-light btn-sm" onClick={closeSidebar} aria-label="Close sidebar">
            ✕
          </button>
        )}
      </div>

      <ul className="nav flex-column p-3">
        {links.map((link) => (
          <li key={link.to} className="nav-item mb-2">
            <NavLink
              to={link.to}
              onClick={() => {
                // only close on small screens
                if (window.innerWidth < 992 && closeSidebar) closeSidebar();
              }}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 px-2 py-2 rounded ${
                  isActive ? "bg-primary text-white" : "text-light"
                }`
              }
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}

        <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

        <li className="nav-item mt-2 px-2">
          <button
            className="btn btn-outline-light w-100 d-flex align-items-center gap-2 justify-content-center"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
