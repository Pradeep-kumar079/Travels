import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        .ft-root {
          background: #1c1510;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
          margin-top: 60px;
        }

        /* Warm overlay */
        .ft-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 5% 100%, rgba(196,108,55,0.22) 0%, transparent 45%),
            radial-gradient(ellipse at 95% 0%, rgba(120,80,40,0.14) 0%, transparent 45%);
          pointer-events: none;
        }

        /* Decorative top ring */
        .ft-root::after {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 380px; height: 380px;
          border: 1.5px solid rgba(196,108,55,0.12);
          border-radius: 50%;
          pointer-events: none;
        }

        /* Vertical BG lines */
        .ft-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .ft-line {
          position: absolute;
          top: 0; bottom: 0;
          width: 1px;
          background: rgba(180,150,100,0.07);
        }
        .ft-line:nth-child(1) { left: 16.66%; }
        .ft-line:nth-child(2) { left: 33.33%; }
        .ft-line:nth-child(3) { left: 50%; }
        .ft-line:nth-child(4) { left: 66.66%; }
        .ft-line:nth-child(5) { left: 83.33%; }

        /* Inner wrap */
        .ft-inner {
          position: relative;
          z-index: 1;
          max-width: 1060px;
          margin: 0 auto;
          padding: 64px 40px 0;
        }

        /* Top grid */
        .ft-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(196,108,55,0.18);
        }

        /* Brand col */
        .ft-brand-col {}

        .ft-wordmark {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .ft-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #c46c37;
          flex-shrink: 0;
        }
        .ft-logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.04em;
        }
        .ft-tagline {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.35);
          margin-bottom: 28px;
          max-width: 240px;
        }

        /* Destination pills */
        .ft-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .ft-pill {
          display: inline-block;
          padding: 5px 12px;
          border: 1px solid rgba(196,108,55,0.3);
          border-radius: 99px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          transition: border-color 0.2s, color 0.2s;
          text-decoration: none;
        }
        .ft-pill:hover {
          border-color: #c46c37;
          color: rgba(255,255,255,0.75);
        }

        /* Nav cols */
        .ft-nav-col {}
        .ft-col-title {
          font-size: 11px;
          font-weight: 600;
          color: #c46c37;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ft-col-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(196,108,55,0.2);
        }

        .ft-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ft-nav-list li a {
          text-decoration: none;
          font-size: 14px;
          color: rgba(255,255,255,0.38);
          font-weight: 400;
          transition: color 0.2s, padding-left 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .ft-nav-list li a::before {
          content: '';
          width: 0;
          height: 1px;
          background: #c46c37;
          transition: width 0.25s ease;
          display: inline-block;
        }
        .ft-nav-list li a:hover {
          color: rgba(255,255,255,0.8);
        }
        .ft-nav-list li a:hover::before {
          width: 12px;
        }

        /* Bottom bar */
        .ft-bottom {
          position: relative;
          z-index: 1;
          max-width: 1060px;
          margin: 0 auto;
          padding: 22px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .ft-copy {
          font-size: 12.5px;
          color: rgba(255,255,255,0.22);
        }
        .ft-copy span {
          color: #c46c37;
          font-weight: 500;
        }
        .ft-socials {
          display: flex;
          gap: 10px;
        }
        .ft-social-btn {
          width: 34px; height: 34px;
          border-radius: 8px;
          border: 1px solid rgba(196,108,55,0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          cursor: pointer;
          background: transparent;
          text-decoration: none;
        }
        .ft-social-btn:hover {
          border-color: #c46c37;
          color: #c46c37;
          background: rgba(196,108,55,0.08);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
          .ft-brand-col {
            grid-column: 1 / -1;
          }
          .ft-tagline { max-width: 100%; }
          .ft-inner { padding: 48px 28px 0; }
          .ft-bottom { padding: 20px 28px; }
        }
        @media (max-width: 560px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }
          .ft-inner { padding: 40px 20px 0; }
          .ft-bottom {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }
        }
        @media (max-width: 380px) {
          .ft-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-lines">
          {[...Array(5)].map((_, i) => <div key={i} className="ft-line" />)}
        </div>

        <div className="ft-inner">
          <div className="ft-grid">

            {/* Brand */}
            <div className="ft-brand-col">
              <div className="ft-wordmark">
                <span className="ft-dot" />
                <span className="ft-logo">BusGo</span>
              </div>
              <p className="ft-tagline">
                Book bus tickets easily with secure payments, live seat selection,
                exclusive offers, and hassle-free journeys across India.
              </p>
              <div className="ft-pills">
                {["Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune"].map(city => (
                  <Link key={city} to="/search-results" className="ft-pill">{city}</Link>
                ))}
              </div>
            </div>

            {/* Customers */}
            <div className="ft-nav-col">
              <p className="ft-col-title">Customers</p>
              <ul className="ft-nav-list">
                <li><Link to="/search-results">Search Buses</Link></li>
                <li><Link to="/offers">Offers & Deals</Link></li>
                <li><Link to="/my-bookings">My Bookings</Link></li>
                <li><Link to="/login">Sign In</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="ft-nav-col">
              <p className="ft-col-title">Company</p>
              <ul className="ft-nav-list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="ft-nav-col">
              <p className="ft-col-title">Support</p>
              <ul className="ft-nav-list">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/support">Customer Support</Link></li>
                <li><Link to="/refunds">Refund Policy</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
              </ul>
            </div>

          </div>
        </div>

        <div className="ft-bottom">
          <p className="ft-copy">
            © {new Date().getFullYear()} <span>BusGo</span>. All rights reserved.
          </p>
          <div className="ft-socials">
            {/* Twitter/X */}
            <a href="#" className="ft-social-btn" aria-label="Twitter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="ft-social-btn" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="ft-social-btn" aria-label="Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;