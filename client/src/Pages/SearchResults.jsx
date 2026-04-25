import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowRight, FiMapPin, FiTrendingUp, FiCheck, FiX } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import "./SelectSeat.css";

const SelectSeat = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // SAFE DEFAULTS
  const bus = state?.bus || null;
  const from = state?.from || "";
  const to = state?.to || "";
  const travelDate = state?.travelDate || new Date();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // ================= FETCH BOOKED SEATS =================
  useEffect(() => {
    if (!bus?._id) return;

    setIsLoading(true);
    axios
      .get("https://travel-backend-83lh.onrender.com/api/seats/booked-seats", {
        params: {
          busId: bus._id,
          travelDate,
        },
      })
      .then((res) => setBookedSeats(res.data.bookedSeats || []))
      .catch((err) => console.error("Seat fetch error:", err))
      .finally(() => setIsLoading(false));
  }, [bus, travelDate]);

  // ================= SEAT GENERATOR =================
  const generateSeats = (prefix, count) => {
    const rows = [];
    let seatNo = 1;

    while (seatNo <= count) {
      rows.push([
        `${prefix}${seatNo++}`,
        seatNo <= count ? `${prefix}${seatNo++}` : "",
        "", // aisle
        seatNo <= count ? `${prefix}${seatNo++}` : "",
        seatNo <= count ? `${prefix}${seatNo++}` : "",
      ]);
    }
    return rows;
  };

  const capacity = bus?.capacity || 0;
  const lowerCount = Math.ceil(capacity / 2);
  const upperCount = Math.floor(capacity / 2);

  const lowerSeats = useMemo(
    () => generateSeats("L", lowerCount),
    [lowerCount]
  );

  const upperSeats = useMemo(
    () => generateSeats("U", upperCount),
    [upperCount]
  );

  // ================= GUARD =================
  if (!bus) {
    return (
      <div className="ss-root">
        <div className="ss-error">
          <FiX className="ss-error-icon" />
          <p>No bus selected. Please go back and select a bus.</p>
          <button className="ss-error-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ================= SEAT TOGGLE =================
  const toggleSeat = (seat) => {
    if (!seat || bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  // ================= RENDER DECK =================
  const renderDeck = (seats) =>
    seats.map((row, rowIndex) => (
      <div key={rowIndex} className="ss-seat-row">
        {row.map((seat, idx) =>
          seat === "" ? (
            <div key={idx} className="ss-seat-gap" />
          ) : (
            <button
              key={seat}
              className={`ss-seat
                ${selectedSeats.includes(seat) ? "ss-seat--selected" : ""}
                ${bookedSeats.includes(seat) ? "ss-seat--booked" : "ss-seat--available"}
              `}
              onClick={() => toggleSeat(seat)}
              disabled={bookedSeats.includes(seat)}
              title={
                bookedSeats.includes(seat)
                  ? "This seat is already booked"
                  : selectedSeats.includes(seat)
                  ? "Click to deselect"
                  : "Click to select"
              }
            >
              {seat}
            </button>
          )
        )}
      </div>
    ));

  const totalFare = selectedSeats.length * (bus?.fare || 0);

  return (
    <div className="ss-root">
      {/* Decorative background */}
      <div className="ss-bg-lines">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="ss-bg-line" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </div>

      <div className="ss-container">
        {/* Header */}
        <div className="ss-header">
          <div className="ss-header-content">
            <h1 className="ss-title">Select Your Seats</h1>
            <p className="ss-subtitle">Choose your preferred seats and proceed to booking</p>
          </div>
          <button className="ss-back-link" onClick={() => navigate(-1)}>
            ← Change Bus
          </button>
        </div>

        {/* Bus Info Card */}
        <div className="ss-bus-info">
          <div className="ss-info-left">
            <h2 className="ss-bus-name">{bus.travelname}</h2>
            <div className="ss-route-info">
              <div className="ss-route-item">
                <FiMapPin className="ss-route-icon" />
                <span>{from}</span>
              </div>
              <FiArrowRight className="ss-route-arrow" />
              <div className="ss-route-item">
                <FiMapPin className="ss-route-icon" />
                <span>{to}</span>
              </div>
            </div>
          </div>
          <div className="ss-info-right">
            <div className="ss-info-stat">
              <p className="ss-stat-label">Bus #</p>
              <p className="ss-stat-value">{bus.bus_no}</p>
            </div>
            <div className="ss-info-stat">
              <p className="ss-stat-label">Type</p>
              <p className="ss-stat-value">{bus.bus_type}</p>
            </div>
            <div className="ss-info-stat">
              <p className="ss-stat-label">Capacity</p>
              <p className="ss-stat-value">{capacity}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="ss-legend">
          <div className="ss-legend-item">
            <div className="ss-legend-seat ss-legend-seat--available" />
            <span>Available</span>
          </div>
          <div className="ss-legend-item">
            <div className="ss-legend-seat ss-legend-seat--selected" />
            <span>Selected</span>
          </div>
          <div className="ss-legend-item">
            <div className="ss-legend-seat ss-legend-seat--booked" />
            <span>Booked</span>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="ss-loading">
            <FaSpinner className="ss-spin" />
            <p>Loading seat availability...</p>
          </div>
        )}

        {/* Seat Selection */}
        {!isLoading && (
          <>
            <div className="ss-seat-selection">
              {/* Lower Deck */}
              <div className="ss-deck">
                <div className="ss-deck-header">
                  <FiTrendingUp className="ss-deck-icon" />
                  <h3>Lower Deck (Sleeper)</h3>
                </div>
                <div className="ss-deck-content">
                  {renderDeck(lowerSeats)}
                </div>
              </div>

              {/* Upper Deck */}
              <div className="ss-deck">
                <div className="ss-deck-header">
                  <FiTrendingUp className="ss-deck-icon ss-deck-icon--upper" />
                  <h3>Upper Deck (Sleeper)</h3>
                </div>
                <div className="ss-deck-content">
                  {renderDeck(upperSeats)}
                </div>
              </div>
            </div>

            {/* Summary & Booking */}
            <div className="ss-summary">
              <div className="ss-summary-content">
                <div className="ss-summary-item">
                  <p className="ss-summary-label">Selected Seats</p>
                  <p className="ss-summary-value">
                    {selectedSeats.length > 0 ? (
                      <>
                        <span className="ss-seats-list">{selectedSeats.join(", ")}</span>
                      </>
                    ) : (
                      <span className="ss-seats-empty">No seats selected</span>
                    )}
                  </p>
                </div>

                <div className="ss-summary-divider" />

                <div className="ss-summary-item">
                  <p className="ss-summary-label">Seats × Fare</p>
                  <p className="ss-summary-value">
                    <span className="ss-qty">{selectedSeats.length} × ₹{bus.fare}</span>
                  </p>
                </div>

                <div className="ss-summary-divider" />

                <div className="ss-summary-item ss-summary-item--total">
                  <p className="ss-summary-label">Total Fare</p>
                  <p className="ss-total-fare">₹ {totalFare}</p>
                </div>
              </div>

              <button
                className={`ss-book-btn ${selectedSeats.length === 0 ? "ss-book-btn--disabled" : ""}`}
                disabled={selectedSeats.length === 0 || isBooking}
                onClick={() => {
                  setIsBooking(true);
                  navigate("/passenger-details", {
                    state: {
                      bus,
                      from,
                      to,
                      selectedSeats,
                      totalFare,
                      travelDate,
                    },
                  });
                  setIsBooking(false);
                }}
              >
                {isBooking ? (
                  <>
                    <FaSpinner className="ss-spin-btn" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="ss-check-icon" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectSeat;