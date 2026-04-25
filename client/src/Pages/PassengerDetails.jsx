import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiMapPin, FiClock, FiUser, FiPhone, FiMail, FiMapPinPlus, FiCheck } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
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

  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // GUARD
  if (!bus) {
    return (
      <div className="pd-root">
        <div className="pd-error">
          <p>No booking data found. Please start from the beginning.</p>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.gender) newErrors.gender = "Please select gender";
    if (!form.age || form.age < 1 || form.age > 120) newErrors.age = "Valid age required";
    if (!form.contact || form.contact.length < 10) newErrors.contact = "Valid contact number required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const confirmBooking = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      navigate("/payment", {
        state: {
          bus,
          from,
          to,
          selectedSeats,
          totalFare,
          passenger: form,
          travelDate,
        },
      });
      setIsSubmitting(false);
    }, 800);
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
    <div className="pd-root">
      {/* Decorative background */}
      <div className="pd-bg-lines">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="pd-bg-line" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>

      <div className="pd-container">
        {/* Header */}
        <div className="pd-header">
          <div className="pd-header-content">
            <h1 className="pd-title">Passenger Information</h1>
            <p className="pd-subtitle">Fill in your details to complete the booking</p>
          </div>
          <button className="pd-back-link" onClick={() => navigate(-1)}>
            ← Change Seats
          </button>
        </div>

        <div className="pd-layout">
          {/* Left - Form */}
          <div className="pd-form-section">
            <form className="pd-form" onSubmit={(e) => { e.preventDefault(); confirmBooking(); }}>
              {/* Name */}
              <div className={`pd-form-group ${focusedField === "name" ? "pd-form-group--focused" : ""} ${errors.name ? "pd-form-group--error" : ""}`}>
                <label className="pd-label">
                  <FiUser className="pd-label-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className="pd-input"
                />
                {errors.name && <span className="pd-error-text">{errors.name}</span>}
              </div>

              {/* Age & Gender Row */}
              <div className="pd-form-row">
                <div className={`pd-form-group ${focusedField === "age" ? "pd-form-group--focused" : ""} ${errors.age ? "pd-form-group--error" : ""}`}>
                  <label className="pd-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Your age"
                    value={form.age}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("age")}
                    onBlur={() => setFocusedField(null)}
                    min="1"
                    max="120"
                    className="pd-input"
                  />
                  {errors.age && <span className="pd-error-text">{errors.age}</span>}
                </div>

                <div className={`pd-form-group ${focusedField === "gender" ? "pd-form-group--focused" : ""} ${errors.gender ? "pd-form-group--error" : ""}`}>
                  <label className="pd-label">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("gender")}
                    onBlur={() => setFocusedField(null)}
                    className="pd-input pd-select"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="pd-error-text">{errors.gender}</span>}
                </div>
              </div>

              {/* Contact & WhatsApp Row */}
              <div className="pd-form-row">
                <div className={`pd-form-group ${focusedField === "contact" ? "pd-form-group--focused" : ""} ${errors.contact ? "pd-form-group--error" : ""}`}>
                  <label className="pd-label">
                    <FiPhone className="pd-label-icon" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    placeholder="10-digit number"
                    value={form.contact}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("contact")}
                    onBlur={() => setFocusedField(null)}
                    className="pd-input"
                  />
                  {errors.contact && <span className="pd-error-text">{errors.contact}</span>}
                </div>

                <div className={`pd-form-group ${focusedField === "whatsapp" ? "pd-form-group--focused" : ""}`}>
                  <label className="pd-label">WhatsApp Number (Optional)</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="Same as above or different"
                    value={form.whatsapp}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("whatsapp")}
                    onBlur={() => setFocusedField(null)}
                    className="pd-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className={`pd-form-group ${focusedField === "email" ? "pd-form-group--focused" : ""} ${errors.email ? "pd-form-group--error" : ""}`}>
                <label className="pd-label">
                  <FiMail className="pd-label-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="pd-input"
                />
                {errors.email && <span className="pd-error-text">{errors.email}</span>}
              </div>

              {/* Address */}
              <div className={`pd-form-group ${focusedField === "address" ? "pd-form-group--focused" : ""}`}>
                <label className="pd-label">
                  <FiMapPinPlus className="pd-label-icon" />
                  Permanent Address (Optional)
                </label>
                <textarea
                  name="address"
                  placeholder="Enter your full address"
                  value={form.address}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                  className="pd-textarea"
                  rows="3"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="pd-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="pd-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="pd-check-icon" />
                    <span>Confirm & Proceed to Payment</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right - Summary */}
          <div className="pd-summary-section">
            <div className="pd-summary">
              {/* Trip Info */}
              <div className="pd-summary-block">
                <h3 className="pd-summary-title">Trip Details</h3>
                
                <div className="pd-trip-card">
                  <h4 className="pd-bus-name">{bus.travelname}</h4>
                  
                  <div className="pd-journey">
                    <div className="pd-journey-point">
                      <FiMapPin className="pd-journey-icon" />
                      <div>
                        <p className="pd-journey-label">From</p>
                        <p className="pd-journey-city">{from}</p>
                      </div>
                    </div>
                    <FiArrowRight className="pd-journey-arrow" />
                    <div className="pd-journey-point">
                      <FiMapPin className="pd-journey-icon" />
                      <div>
                        <p className="pd-journey-label">To</p>
                        <p className="pd-journey-city">{to}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pd-trip-info-grid">
                    <div className="pd-info-item">
                      <span className="pd-info-label">Departure</span>
                      <span className="pd-info-value">{bus.departure_time}</span>
                    </div>
                    <div className="pd-info-item">
                      <span className="pd-info-label">Arrival</span>
                      <span className="pd-info-value">{bus.arrival_time}</span>
                    </div>
                    <div className="pd-info-item">
                      <span className="pd-info-label">Date</span>
                      <span className="pd-info-value">{formatDate(travelDate)}</span>
                    </div>
                    <div className="pd-info-item">
                      <span className="pd-info-label">Bus Type</span>
                      <span className="pd-info-value">{bus.bus_type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seats */}
              <div className="pd-summary-block">
                <h3 className="pd-summary-title">Seats Selected</h3>
                <div className="pd-seats-display">
                  {selectedSeats.map((seat) => (
                    <span key={seat} className="pd-seat-badge">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Driver Info */}
              <div className="pd-summary-block">
                <h3 className="pd-summary-title">Driver Information</h3>
                <div className="pd-driver-info">
                  <div className="pd-driver-item">
                    <span className="pd-driver-label">Driver Name</span>
                    <span className="pd-driver-value">{bus.driver_name}</span>
                  </div>
                  <div className="pd-driver-item">
                    <span className="pd-driver-label">Contact</span>
                    <span className="pd-driver-value">{bus.contact_number}</span>
                  </div>
                </div>
              </div>

              {/* Fare Summary */}
              <div className="pd-fare-section">
                <div className="pd-fare-breakdown">
                  <div className="pd-fare-item">
                    <span className="pd-fare-label">
                      {selectedSeats.length} Seat{selectedSeats.length !== 1 ? "s" : ""} × ₹{bus.fare}
                    </span>
                    <span className="pd-fare-value">₹{totalFare}</span>
                  </div>
                </div>
                <div className="pd-total-fare">
                  <p className="pd-total-label">Total Amount</p>
                  <p className="pd-total-value">₹{totalFare}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;