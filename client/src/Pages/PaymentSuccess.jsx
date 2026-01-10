import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get("order_id");

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/payment/verify/${orderId}`
        );

        setStatus(res.data.success ? "success" : "failed");
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [orderId]);

  // 🔄 VERIFYING
  if (status === "verifying") {
    return (
      <div className="payment-status loading">
        <h2>⏳ Verifying payment...</h2>
        <p>Please do not refresh the page</p>
      </div>
    );
  }

  // ❌ FAILED
  if (status === "failed") {
    return (
      <div className="payment-status failed">
        <h2>❌ Payment Failed</h2>
        <p>If amount was deducted, it will be refunded automatically.</p>
        <button onClick={() => navigate("/home")}>Go Home</button>
      </div>
    );
  }

  // ✅ SUCCESS
  return (
    <div className="payment-status success">
      <h1>✅ Payment Successful</h1>
      <p>Your booking is confirmed 🎉</p>
      <p><strong>Order ID:</strong> {orderId}</p>

      <button onClick={() => navigate("/home")}>
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
