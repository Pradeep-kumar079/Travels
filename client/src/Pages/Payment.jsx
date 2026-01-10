import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

const Payment = () => {
  const { state } = useLocation();

  if (!state) return <p>No payment data</p>;

  const { bus, selectedSeats, totalFare, passenger, travelDate } = state;

  const handlePayment = async () => {
    try {
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
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2>Confirm Your Payment</h2>

        <div className="trip-info">
          <h3>{bus.travelname}</h3>
          <p className="route">
            {bus.from} → {bus.to}
          </p>
          <p className="date">
            {new Date(travelDate).toDateString()}
          </p>
        </div>

        <div className="divider" />

        <div className="details">
          <div>
            <span>Passenger</span>
            <strong>{passenger.name}</strong>
          </div>
          <div>
            <span>Seats</span>
            <strong>{selectedSeats.join(", ")}</strong>
          </div>
          <div>
            <span>Fare per seat</span>
            <strong>₹ {bus.fare}</strong>
          </div>
        </div>

        <div className="total-box">
          <span>Total Amount</span>
          <h1>₹ {totalFare}</h1>
        </div>

        <button className="pay-btn" onClick={handlePayment}>
          Pay Securely ₹{totalFare}
        </button>

        <p className="secure-note">
          🔒 100% secure payment powered by Cashfree
        </p>
      </div>
    </div>
  );
};

export default Payment;
