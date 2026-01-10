import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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

  // ================= FETCH BOOKED SEATS =================
  useEffect(() => {
    if (!bus?._id) return;

    axios
      .get("http://localhost:3000/api/seats/booked-seats", {
        params: {
          busId: bus._id,
          travelDate,
        },
      })
      .then((res) => setBookedSeats(res.data.bookedSeats || []))
      .catch((err) => console.error("Seat fetch error:", err));
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
    return <p style={{ padding: 20 }}>No bus selected</p>;
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
      <div key={rowIndex} className="seat-row">
        {row.map((seat, idx) =>
          seat === "" ? (
            <div key={idx} className="seat-gap" />
          ) : (
            <div
              key={seat}
              className={`seat
                ${selectedSeats.includes(seat) ? "selected" : ""}
                ${bookedSeats.includes(seat) ? "booked" : ""}
              `}
              onClick={() => toggleSeat(seat)}
            >
              {seat}
            </div>
          )
        )}
      </div>
    ));

  return (
    <div className="seat-container">
      {/* HEADER */}
      <div className="seat-header">
        <h2>{bus.travelname}</h2>
        <p>{from} → {to}</p>
        <span>Bus No: {bus.bus_no}</span>
      </div>

      {/* LEGEND */}
      <div className="seat-legend">
        <div className="legend-item">
          <span className="legend-seat available"></span>
          <p>Available</p>
        </div>
        <div className="legend-item">
          <span className="legend-seat selected"></span>
          <p>Selected</p>
        </div>
        <div className="legend-item">
          <span className="legend-seat booked"></span>
          <p>Booked</p>
        </div>
      </div>

      {/* BUS LAYOUT */}
      <div className="bus-layout">
        <div className="deck">
          <h3>Lower Deck (Sleeper)</h3>
          {renderDeck(lowerSeats)}
        </div>

        <div className="deck">
          <h3>Upper Deck (Sleeper)</h3>
          {renderDeck(upperSeats)}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="seat-summary">
        <p>
          Selected Seats:{" "}
          <strong>
            {selectedSeats.length ? selectedSeats.join(", ") : "None"}
          </strong>
        </p>

        <p>
          Total Fare:{" "}
          <strong>₹ {selectedSeats.length * bus.fare}</strong>
        </p>

        <button
          disabled={!selectedSeats.length}
          onClick={() =>
            navigate("/passenger-details", {
              state: {
                bus,
                from,
                to,
                selectedSeats,
                totalFare: selectedSeats.length * bus.fare,
                travelDate,
              },
            })
          }
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default SelectSeat;
