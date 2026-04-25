import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowRight, FiMapPin, FiClock, FiUser, FiPhone, FiMail, FiShield, FiLock, FiCheck } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import "./Payment.css";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state) {
    return (
      <div className="py-root">
        <div className="py-error">
          <FiLock className="py-error-icon" />
          <p>No payment information found.</p>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  const { bus, selectedSeats, totalFare, passenger, travelDate, from, to } = state;

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://travel-backend-83lh.onrender.com/api/payment/create-order",
        {
          amount: totalFare,
          customer: passenger,
          busId: bus._id,
          seats: selectedSeats,
          travelDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cashfree = window.Cashfree({ mode: "sandbox" });

      cashfree.checkout({
        paymentSessionId: res.data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
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
    <div className="py-root">
      {/* Decorative background */}
      <div className="py-bg-lines">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="py-bg-line" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </div>

      <div className="py-container">
        {/* Header */}
        <div className="py-header">
          <h1 className="py-title">Order Summary</h1>
          <p className="py-subtitle">Review your booking details before payment</p>
        </div>

        <div className="py-layout">
          {/* Left - Order Details */}
          <div className="py-details-section">
            {/* Trip Card */}
            <div className="py-card py-trip-card">
              <h2 className="py-card-title">Trip Details</h2>

              <div className="py-journey">
                <div className="py-journey-point">
                  <FiMapPin className="py-journey-icon" />
                  <div>
                    <p className="py-journey-label">From</p>
                    <p className="py-journey-city">{from}</p>
                  </div>
                </div>
                <FiArrowRight className="py-journey-arrow" />
                <div className="py-journey-point">
                  <FiMapPin className="py-journey-icon" />
                  <div>
                    <p className="py-journey-label">To</p>
                    <p className="py-journey-city">{to}</p>
                  </div>
                </div>
              </div>

              <div className="py-trip-info">
                <div className="py-trip-item">
                  <span className="py-trip-label">Bus</span>
                  <span className="py-trip-value">{bus.travelname}</span>
                </div>
                <div className="py-trip-item">
                  <FiClock className="py-trip-icon" />
                  <span className="py-trip-value">{formatDate(travelDate)}</span>
                </div>
              </div>
            </div>

            {/* Passenger Card */}
            <div className="py-card">
              <h3 className="py-card-title">Passenger Information</h3>

              <div className="py-info-grid">
                <div className="py-info-item">
                  <FiUser className="py-info-icon" />
                  <div>
                    <p className="py-info-label">Name</p>
                    <p className="py-info-value">{passenger.name}</p>
                  </div>
                </div>

                <div className="py-info-item">
                  <span className="py-info-badge">{passenger.gender}</span>
                  <div>
                    <p className="py-info-label">Gender</p>
                    <p className="py-info-value">{passenger.age} years</p>
                  </div>
                </div>

                <div className="py-info-item">
                  <FiPhone className="py-info-icon" />
                  <div>
                    <p className="py-info-label">Contact</p>
                    <p className="py-info-value">{passenger.contact}</p>
                  </div>
                </div>

                <div className="py-info-item">
                  <FiMail className="py-info-icon" />
                  <div>
                    <p className="py-info-label">Email</p>
                    <p className="py-info-value">{passenger.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seats Card */}
            <div className="py-card">
              <h3 className="py-card-title">Booked Seats</h3>

              <div className="py-seats-display">
                {selectedSeats.map((seat) => (
                  <span key={seat} className="py-seat-badge">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Price Summary & Payment */}
          <div className="py-payment-section">
            {/* Price Breakdown */}
            <div className="py-card py-price-card">
              <h3 className="py-card-title">Price Breakdown</h3>

              <div className="py-price-breakdown">
                <div className="py-price-item">
                  <span className="py-price-label">
                    {selectedSeats.length} Seat{selectedSeats.length !== 1 ? "s" : ""} × ₹{bus.fare}
                  </span>
                  <span className="py-price-value">₹{totalFare}</span>
                </div>

                <div className="py-price-item py-price-item--taxes">
                  <span className="py-price-label">Taxes & Fees</span>
                  <span className="py-price-value">₹0</span>
                </div>

                <div className="py-divider" />

                <div className="py-total-amount">
                  <span className="py-total-label">Total Amount</span>
                  <span className="py-total-value">₹{totalFare}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="py-card">
              <h3 className="py-card-title">Payment Method</h3>

              <div className="py-payment-method">
                <div className="py-method-item py-method-item--active">
                  <div className="py-method-radio">
                    <FiCheck className="py-method-check" />
                  </div>
                  <div>
                    <p className="py-method-name">Online Payment</p>
                    <p className="py-method-desc">Secure payment via Cashfree</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="py-security-box">
              <FiShield className="py-security-icon" />
              <div className="py-security-content">
                <p className="py-security-title">Secure & Protected</p>
                <p className="py-security-text">100% secure payment powered by Cashfree</p>
              </div>
            </div>

            {/* Pay Button */}
            <button
              className={`py-pay-btn ${isProcessing ? "py-pay-btn--loading" : ""}`}
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="py-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FiLock className="py-lock-icon" />
                  <span>Pay Securely ₹{totalFare}</span>
                </>
              )}
            </button>

            <p className="py-policy">
              By continuing, you agree to our Terms & Conditions and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;