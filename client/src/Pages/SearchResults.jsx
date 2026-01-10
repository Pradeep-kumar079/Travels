import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchResults.css";

const SearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { from, to, travelDate } = state || {};

  const [busList, setBusList] = useState([]);

useEffect(() => {
  if (!from || !to || !travelDate) {
    console.log("❌ Missing search params", { from, to, travelDate });
    return;
  }

  console.log("🔍 Searching buses with:", {
    from,
    to,
    travelDate,
  });

  axios
    .get("https://travel-backend-83lh.onrender.com/api/buses/search", {
      params: { from, to, travelDate },
    })
    .then((res) => {
      console.log("✅ API Response:", res.data);
      setBusList(res.data.buses);
    })
    .catch((err) => {
      console.error("❌ Search API error:", err.response || err);
    });
}, [from, to, travelDate]);



  const handleSelectBus = (bus) => {
    navigate("/select-seat", {
      state: { bus, from, to, travelDate },
    });
  };

  return (
    <div className="search-results-container">
      <h2 className="route-title">
        {from} <span>→</span> {to}
      </h2>

      {busList.length === 0 ? (
        <p className="no-results">No buses available</p>
      ) : (
        <div className="buses-list">
          {busList.map((bus) => (
            <div
              key={bus._id}
              className="bus-card"
              onClick={() => handleSelectBus(bus)}
            >
              <div className="bus-card-header">
                <h3>{bus.travelname}</h3>
                <span className="bus-type">{bus.bus_type}</span>
              </div>

              <div className="time-row">
                <div>
                  <p className="time">{bus.departure_time}</p>
                  <small>Departure</small>
                </div>
                <div>
                  <p className="time">{bus.arrival_time}</p>
                  <small>Arrival</small>
                </div>
              </div>

              <div className="details-grid">
                <p><strong>Bus No:</strong> {bus.bus_no}</p>
                <p><strong>Driver:</strong> {bus.driver_name}</p>
                <p><strong>Contact:</strong> {bus.contact_number}</p>
                <p>
                  <strong>Available Seats:</strong>{" "}
                  <span
                    className={
                      bus.available_seats === 0 ? "sold-out" : "available"
                    }
                  >
                    {bus.available_seats}
                  </span>
                </p>
              </div>

              <div className="bus-card-footer">
                <div className="fare">₹ {bus.fare}</div>

                {bus.available_seats === 0 ? (
                  <span className="status sold">Sold Out</span>
                ) : (
                  <span className="status available">Available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
};

export default SearchResults;
