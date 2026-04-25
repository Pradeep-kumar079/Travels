import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowRight, FiMapPin, FiClock, FiUser, FiPhone, FiChevronRight } from "react-icons/fi";
import { FaBus, FaSpinner } from "react-icons/fa";
import "./SearchResults.css";

const SearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { from, to, travelDate } = state || {};

  const [busList, setBusList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    if (!from || !to || !travelDate) {
      setError("Missing search parameters. Please search again.");
      return;
    }

    setIsLoading(true);
    setError("");

    axios
      .get("https://travel-backend-83lh.onrender.com/api/buses/search", {
        params: { from, to, travelDate },
      })
      .then((res) => {
        setBusList(res.data.buses || []);
        if (!res.data.buses || res.data.buses.length === 0) {
          setError("No buses available for this route. Try a different date.");
        }
      })
      .catch((err) => {
        setError("Failed to fetch buses. Please try again.");
        console.error("Search API error:", err.response || err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [from, to, travelDate]);

  const filteredBuses = busList.filter((bus) => {
    if (selectedFilter === "available") return bus.available_seats > 0;
    if (selectedFilter === "luxury") return bus.bus_type === "Luxury";
    return true;
  });

  const handleSelectBus = (bus) => {
    navigate("/select-seat", {
      state: { bus, from, to, travelDate },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="sr-root">
      {/* Decorative background */}
      <div className="sr-bg-lines">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="sr-bg-line" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>

      <div className="sr-container">
        {/* Header */}
        <div className="sr-header">
          <div className="sr-header-content">
            <div className="sr-journey">
              <div className="sr-location">
                <FiMapPin className="sr-icon" />
                <span className="sr-city">{from}</span>
              </div>
              <div className="sr-arrow-wrapper">
                <FiArrowRight className="sr-arrow" />
              </div>
              <div className="sr-location">
                <FiMapPin className="sr-icon" />
                <span className="sr-city">{to}</span>
              </div>
            </div>
            <p className="sr-date">
              <FiClock className="sr-icon-small" />
              {formatDate(travelDate)}
            </p>
          </div>
          <button className="sr-back-btn" onClick={() => navigate(-1)}>
            ← Modify Search
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="sr-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="sr-loading">
            <FaSpinner className="sr-spin" />
            <p>Finding the best buses for you...</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && busList.length > 0 && (
          <>
            {/* Filters */}
            <div className="sr-filters">
              <button
                className={`sr-filter-btn ${selectedFilter === "all" ? "sr-filter-btn--active" : ""}`}
                onClick={() => setSelectedFilter("all")}
              >
                All Buses
                <span className="sr-filter-badge">{busList.length}</span>
              </button>
              <button
                className={`sr-filter-btn ${selectedFilter === "available" ? "sr-filter-btn--active" : ""}`}
                onClick={() => setSelectedFilter("available")}
              >
                Available Only
                <span className="sr-filter-badge">
                  {busList.filter((b) => b.available_seats > 0).length}
                </span>
              </button>
              <button
                className={`sr-filter-btn ${selectedFilter === "luxury" ? "sr-filter-btn--active" : ""}`}
                onClick={() => setSelectedFilter("luxury")}
              >
                Luxury
                <span className="sr-filter-badge">
                  {busList.filter((b) => b.bus_type === "Luxury").length}
                </span>
              </button>
            </div>

            {/* Buses list */}
            <div className="sr-buses-list">
              {filteredBuses.length > 0 ? (
                filteredBuses.map((bus, index) => (
                  <div key={bus._id} className="sr-bus-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="sr-card-main" onClick={() => handleSelectBus(bus)}>
                      {/* Top section */}
                      <div className="sr-card-top">
                        <div className="sr-bus-header">
                          <div>
                            <h3 className="sr-bus-name">{bus.travelname}</h3>
                            <p className="sr-bus-number">Bus #{bus.bus_no}</p>
                          </div>
                          <span className={`sr-badge sr-badge--${bus.bus_type.toLowerCase()}`}>
                            {bus.bus_type}
                          </span>
                        </div>
                      </div>

                      {/* Times section */}
                      <div className="sr-times-section">
                        <div className="sr-time-block">
                          <p className="sr-time-value">{bus.departure_time}</p>
                          <p className="sr-time-label">Departure</p>
                        </div>

                        <div className="sr-journey-line">
                          <div className="sr-dot sr-dot--start" />
                          <div className="sr-line" />
                          <div className="sr-dot sr-dot--end" />
                        </div>

                        <div className="sr-time-block sr-time-block--end">
                          <p className="sr-time-value">{bus.arrival_time}</p>
                          <p className="sr-time-label">Arrival</p>
                        </div>
                      </div>

                      {/* Details grid */}
                      <div className="sr-details-grid">
                        <div className="sr-detail-item">
                          <FiUser className="sr-detail-icon" />
                          <div>
                            <p className="sr-detail-label">Driver</p>
                            <p className="sr-detail-value">{bus.driver_name}</p>
                          </div>
                        </div>
                        <div className="sr-detail-item">
                          <FiPhone className="sr-detail-icon" />
                          <div>
                            <p className="sr-detail-label">Contact</p>
                            <p className="sr-detail-value">{bus.contact_number}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right section - Price & Seats */}
                    <div className="sr-card-right">
                      <div className="sr-price-section">
                        <p className="sr-price-label">From</p>
                        <p className="sr-price">₹{bus.fare}</p>
                      </div>

                      <div className={`sr-seats ${bus.available_seats === 0 ? "sr-seats--soldout" : ""}`}>
                        <p className="sr-seats-count">{bus.available_seats}</p>
                        <p className="sr-seats-label">Seats</p>
                      </div>

                      <button
                        className={`sr-cta-btn ${bus.available_seats === 0 ? "sr-cta-btn--disabled" : ""}`}
                        disabled={bus.available_seats === 0}
                      >
                        {bus.available_seats === 0 ? "Sold Out" : "Select"}
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sr-no-results">
                  <FaBus className="sr-empty-icon" />
                  <p>No buses match your filter</p>
                </div>
              )}
            </div>
          </>
        )}

        {!isLoading && busList.length === 0 && !error && (
          <div className="sr-no-results">
            <FaBus className="sr-empty-icon" />
            <p>No buses available for this route</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;