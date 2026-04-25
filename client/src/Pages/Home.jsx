import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadset, faTicket, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import logo from "../Assets/logo.png";
import posters from "../Assets/travel-back.jpg";
import { FaRightLeft } from "react-icons/fa6";
import Offers from "../Pages/Offers.jsx";
import Footer from "../Pages/Footer.jsx";

const Home = () => {
  const [msg, setMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState({ from: "", to: "", date: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get("https://travel-backend-83lh.onrender.com/");
        setMsg(response.data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };
    fetchMessage();
  }, []);

  const LogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleSearch = () => {
    if (!searchTerm.from || !searchTerm.to || !searchTerm.date) {
      alert("Please enter From, To and Date");
      return;
    }
    navigate("/search-results", {
      state: {
        from: searchTerm.from.trim().toLowerCase(),
        to: searchTerm.to.trim().toLowerCase(),
        travelDate: searchTerm.date,
      },
    });
  };

  const swapLocations = () => {
    setSearchTerm((prev) => ({ ...prev, from: prev.to, to: prev.from }));
  };

  return (
    <div className="hm-root">

      {/* BG lines decoration */}
      <div className="hm-lines" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="hm-line" />
        ))}
      </div>

      {/* ── NAVBAR ── */}
      <nav className="hm-nav">
        <div className="hm-nav-inner">

          <div className="hm-logo">
            <img src={logo} alt="Wandr logo" />
          </div>

          {/* Desktop links */}
          <div className="hm-nav-links">
            <Link to="/contact" className="hm-nav-item">
              <FontAwesomeIcon icon={faHeadset} className="hm-nav-icon" />
              <span>Contact</span>
            </Link>
            <button className="hm-nav-item" onClick={() => navigate("/my-bookings")}>
              <FontAwesomeIcon icon={faTicket} className="hm-nav-icon" />
              <span>My Bookings</span>
            </button>
            <Link to="/profile" className="hm-nav-item">
              <FontAwesomeIcon icon={faUser} className="hm-nav-icon" />
              <span>Account</span>
            </Link>
            <button className="hm-nav-item hm-nav-logout" onClick={LogOut}>
              <span>Log out</span>
            </button>
          </div>

          {/* Hamburger for mobile */}
          <button
            className={`hm-hamburger ${menuOpen ? "hm-hamburger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="hm-mobile-menu">
            <Link to="/contact" className="hm-mob-item" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faHeadset} /> Contact
            </Link>
            <button className="hm-mob-item" onClick={() => { navigate("/my-bookings"); setMenuOpen(false); }}>
              <FontAwesomeIcon icon={faTicket} /> My Bookings
            </button>
            <Link to="/profile" className="hm-mob-item" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faUser} /> Account
            </Link>
            <button className="hm-mob-item hm-mob-logout" onClick={LogOut}>
              Log out
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="hm-hero">
        <div className="hm-hero-img-wrap">
          <img src={posters} alt="Travel destination" className="hm-hero-img" />
          <div className="hm-hero-overlay" />
        </div>

        <div className="hm-hero-content">
          <p className="hm-hero-eyebrow">Your journey begins here</p>
          <h1 className="hm-hero-title">
            Find your<br />
            <span className="hm-hero-stroke">perfect ride.</span>
          </h1>
          <p className="hm-hero-sub">
            Book intercity buses fast, easy, and affordable.
          </p>
        </div>
      </section>

      {/* ── SEARCH CARD ── */}
      <section className="hm-search-wrap">
        <div className="hm-search-card">
          <p className="hm-search-label">Search buses</p>

          <div className="hm-search-row">

            <div className="hm-search-field">
              <label className="hm-field-label">From</label>
              <input
                className="hm-input"
                type="text"
                placeholder="Departure city"
                value={searchTerm.from}
                onChange={(e) => setSearchTerm({ ...searchTerm, from: e.target.value })}
              />
            </div>

            <button className="hm-swap" onClick={swapLocations} title="Swap locations">
              <FaRightLeft />
            </button>

            <div className="hm-search-field">
              <label className="hm-field-label">To</label>
              <input
                className="hm-input"
                type="text"
                placeholder="Arrival city"
                value={searchTerm.to}
                onChange={(e) => setSearchTerm({ ...searchTerm, to: e.target.value })}
              />
            </div>

            <div className="hm-search-field">
              <label className="hm-field-label">Date</label>
              <input
                className="hm-input hm-input-date"
                type="date"
                value={searchTerm.date}
                onChange={(e) => setSearchTerm({ ...searchTerm, date: e.target.value })}
              />
            </div>

            <button className="hm-search-btn" onClick={handleSearch}>
              Search <span className="hm-search-arrow">→</span>
            </button>

          </div>
        </div>
      </section>

      {/* ── OFFERS & FOOTER ── */}
      <Offers />
      <Footer />
    </div>
  );
};

export default Home;