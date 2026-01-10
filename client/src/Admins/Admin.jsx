import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";
import img from "../Assets/logo.png";

const Admin = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* Left Sidebar */}
      <div className="admin-left">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/all-users">Users</Link></li>
          <li><Link to="/admin/buses">Buses</Link></li>
          <li><Link to="/admin/add-offers">Offers</Link></li>
          <li><Link to="/admin/reports">Reports</Link></li>
          <li><Link to="/admin/tickets">Tickets</Link></li>
        </ul>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Right Section */}
      <div className="admin-right">
        <header className="admin-header">
          <div className="welcome-text">
            <h3>Welcome to the Admin Dashboard</h3>
            <p>Manage users, buses, offers, and reports here.</p>
          </div>
          <div className="profile">
            <img src={img} alt="Profile" className="profile-img" />
            <p className="profile-name">Admin</p>
          </div>
        </header>

        <main className="admin-content">
          <p>Select a section from the left to manage the system.</p>
        </main>
      </div>
    </div>
  );
};

export default Admin;
