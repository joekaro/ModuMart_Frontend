// src/layouts/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 992 : true
  );

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => {
    if (window.innerWidth < 992) setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 992) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* Overlay for small screens */}
      {isSidebarOpen && window.innerWidth < 992 && (
        <div
          onClick={closeSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1040,
          }}
        />
      )}

      {/* Main content */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: isSidebarOpen && window.innerWidth >= 992 ? "240px" : "0",
          transition: "margin-left 0.25s ease",
          backgroundColor: "#f8f9fa",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Navbar fixed at top */}
        <nav
          className="navbar navbar-light bg-white shadow-sm px-3"
          style={{ flexShrink: 0 }}
        >
          <button
            className="btn btn-outline-primary d-lg-none me-2"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <span className="navbar-brand mb-0 h5">Admin Panel</span>
        </nav>

        {/* Scrollable content area */}
        <div
          className="flex-grow-1 overflow-auto"
          style={{
            padding: "1.5rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
