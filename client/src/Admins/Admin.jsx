import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX, FiHome, FiUsers,  FiGift, FiFileText, FiSettings } from "react-icons/fi";
import "./Admin.css";
import { FaBus } from "react-icons/fa";
import { FaTicketAlt } from "react-icons/fa";

const Admin = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome, path: "/admin/dashboard" },
    { id: "users", label: "Users", icon: FiUsers, path: "/admin/all-users" },
    { id: "buses", label: "Buses", icon: FaBus, path: "/admin/buses" },
    { id: "offers", label: "Offers", icon: FiGift, path: "/admin/add-offers" },
    { id: "reports", label: "Reports", icon: FiFileText, path: "/admin/reports" },
    { id: "tickets", label: "Tickets", icon: FaTicketAlt, path: "/admin/tickets" },
  ];

  return (
    <div className="adm-root">
      {/* Decorative background */}
      <div className="adm-bg-lines">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="adm-bg-line" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>

      {/* Sidebar */}
      <aside className={`adm-sidebar ${sidebarOpen ? "adm-sidebar--open" : ""}`}>
        <div className="adm-sidebar-inner">
          {/* Logo */}
          <div className="adm-logo">
            <span className="adm-logo-dot" />
            <span className="adm-logo-text">Wandr</span>
            <span className="adm-badge">Admin</span>
          </div>

          {/* Navigation */}
          <nav className="adm-nav">
            <p className="adm-nav-label">Management</p>
            <ul className="adm-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      className={`adm-nav-item ${activeNav === item.id ? "adm-nav-item--active" : ""}`}
                      onClick={() => {
                        setActiveNav(item.id);
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="adm-nav-icon" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Settings */}
          <div className="adm-sidebar-footer">
            <button className="adm-sidebar-action">
              <FiSettings />
              <span>Settings</span>
            </button>
            <button className="adm-logout-btn" onClick={logout}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        className="adm-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Main content */}
      <main className="adm-main">
        {/* Header */}
        <header className="adm-header">
          <div className="adm-header-left">
            <h1 className="adm-header-title">Dashboard</h1>
            <p className="adm-header-sub">Manage your travel platform</p>
          </div>

          <div className="adm-header-right">
            <div className="adm-user-card">
              <div className="adm-user-avatar">A</div>
              <div className="adm-user-info">
                <p className="adm-user-name">Administrator</p>
                <p className="adm-user-role">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <section className="adm-content">
          <div className="adm-content-header">
            <h2 className="adm-content-title">Welcome Back</h2>
            <p className="adm-content-desc">Select a section from the sidebar to begin managing the system</p>
          </div>

          {/* Quick stats */}
          <div className="adm-stats-grid">
            <div className="adm-stat-card">
              <div className="adm-stat-icon adm-stat-icon--users">
                <FiUsers />
              </div>
              <div className="adm-stat-content">
                <p className="adm-stat-label">Total Users</p>
                <p className="adm-stat-value">1,240</p>
              </div>
            </div>

            <div className="adm-stat-card">
              <div className="adm-stat-icon adm-stat-icon--buses">
                <FaBus />
              </div>
              <div className="adm-stat-content">
                <p className="adm-stat-label">Active Buses</p>
                <p className="adm-stat-value">89</p>
              </div>
            </div>

            <div className="adm-stat-card">
              <div className="adm-stat-icon adm-stat-icon--tickets">
                <FaTicketAlt />
              </div>
              <div className="adm-stat-content">
                <p className="adm-stat-label">Bookings Today</p>
                <p className="adm-stat-value">342</p>
              </div>
            </div>

            <div className="adm-stat-card">
              <div className="adm-stat-icon adm-stat-icon--revenue">
                <FiGift />
              </div>
              <div className="adm-stat-content">
                <p className="adm-stat-label">Active Offers</p>
                <p className="adm-stat-value">24</p>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="adm-card">
            <div className="adm-card-header">
              <h3 className="adm-card-title">Recent Activity</h3>
              <a href="#" className="adm-card-link">View all</a>
            </div>
            <div className="adm-activity-list">
              {[
                { action: "New user registered", time: "2 minutes ago", icon: "👤" },
                { action: "Bus route updated", time: "15 minutes ago", icon: "🚌" },
                { action: "Offer created", time: "1 hour ago", icon: "🎁" },
                { action: "Booking confirmed", time: "2 hours ago", icon: "✓" },
              ].map((activity, i) => (
                <div key={i} className="adm-activity-item">
                  <span className="adm-activity-icon">{activity.icon}</span>
                  <div className="adm-activity-text">
                    <p className="adm-activity-action">{activity.action}</p>
                    <p className="adm-activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;