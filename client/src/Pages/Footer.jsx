import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-section">
          <h3 className="footer-logo">BusGo</h3>
          <p className="footer-text">
            Book bus tickets easily with secure payments, live seat selection,
            exclusive offers, and hassle-free journeys.
          </p>
        </div>

        {/* User Features */}
        <div className="footer-section">
          <h4>For Customers</h4>
          <ul>
            <li><Link to="/search-results">Search Buses</Link></li>
            <li><Link to="/offers">Offers</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Admin & Support */}
        <div className="footer-section">
          <h4>Admin & Support</h4>
          <ul>
            {/* <li><Link to="/admin">Admin Panel</Link></li>
            <li><Link to="/admin/add-offers">Manage Offers</Link></li> */}
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/support">Customer Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BusGo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
