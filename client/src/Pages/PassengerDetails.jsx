import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PassengerDetails.css";

const PassengerDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // SAFE DEFAULTS
  const bus = state?.bus || null;
  const from = state?.from || "";
  const to = state?.to || "";
  const selectedSeats = state?.selectedSeats || [];
  const totalFare = state?.totalFare || 0;
  const travelDate = state?.travelDate;


  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    address: "",
    contact: "",
    whatsapp: "",
    email: "",
  });

  // GUARD
  if (!bus) {
    return <p style={{ padding: 20 }}>No booking data</p>;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const confirmBooking = () => {
    if (!form.name || !form.gender || !form.age || !form.contact) {
      alert("Please fill all required fields");
      return;
    }

    // 👉 MOVE TO PAYMENT PAGE
    navigate("/payment", {
      state: {
        bus,
        from,
        to,
        selectedSeats,
        totalFare,
        passenger: form,
        travelDate
      },
    });
  };

  return (
    <div className="passenger-container">
      {/* FORM */}
      <div className="passenger-form">
        <h2>Passenger Details</h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" onChange={handleChange} />

        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input name="contact" placeholder="Contact Number" onChange={handleChange} />
        <input name="whatsapp" placeholder="WhatsApp Number" onChange={handleChange} />
        <input
  name="email"
  placeholder="Email Address"
  onChange={handleChange}
/>


        <textarea
          name="address"
          placeholder="Permanent Address"
          onChange={handleChange}
        />

        <button onClick={confirmBooking}>Confirm Booking</button>
      </div>

      {/* SUMMARY */}
      <div className="booking-summary">
        <h3>Trip Summary</h3>

        <p><strong>{bus.travelname}</strong></p>
        <p>{from} → {to}</p>
        <p><strong>Departure:</strong> {bus.departure_time}</p>
        <p><strong>Arrival:</strong> {bus.arrival_time}</p>
        <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
        <p><strong>Driver:</strong> {bus.driver_name}</p>
        <p><strong>Contact:</strong> {bus.contact_number}</p>

        <hr />

        <h2>Total Fare: ₹{totalFare}</h2>
      </div>
    </div>
  );
};

export default PassengerDetails;
