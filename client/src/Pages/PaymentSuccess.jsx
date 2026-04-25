import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get("order_id");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!orderId) { setStatus("failed"); return; }
    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `https://travel-backend-83lh.onrender.com/api/payment/verify/${orderId}`
        );
        setStatus(res.data.success ? "success" : "failed");
      } catch {
        setStatus("failed");
      }
    };
    verifyPayment();
  }, [orderId]);

  const config = {
    verifying: {
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" stroke="rgba(196,108,55,0.3)" strokeWidth="2"/>
          <path d="M28 8 a20 20 0 0 1 20 20" stroke="#c46c37" strokeWidth="2.5" strokeLinecap="round"
            style={{animation: 'ps-spin 0.9s linear infinite', transformOrigin:'28px 28px'}}/>
        </svg>
      ),
      eyebrow: "Please wait",
      title: <>Verifying<br/>your payment.</>,
      sub: "Do not refresh or close this page.",
      btnLabel: null,
    },
    success: {
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" stroke="rgba(196,108,55,0.3)" strokeWidth="2"/>
          <path d="M16 28 l9 9 l15-16" stroke="#c46c37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{strokeDasharray:40, strokeDashoffset:40, animation:'ps-draw 0.6s 0.2s ease forwards'}}/>
        </svg>
      ),
      eyebrow: "Booking confirmed",
      title: <>Payment<br/>successful!</>,
      sub: "Your adventure is officially booked. Get ready to explore.",
      btnLabel: "Start Exploring",
    },
    failed: {
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" stroke="rgba(196,108,55,0.2)" strokeWidth="2"/>
          <path d="M19 19 l18 18 M37 19 l-18 18" stroke="#c46c37" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      eyebrow: "Something went wrong",
      title: <>Payment<br/><span style={{WebkitTextStroke:'1.5px #c46c37', color:'transparent'}}>failed.</span></>,
      sub: "If any amount was deducted, it will be refunded automatically within 5-7 days.",
      btnLabel: "Go Back Home",
    },
  };

  const c = config[status];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes ps-spin { to { transform: rotate(360deg); } }
        @keyframes ps-draw { to { stroke-dashoffset: 0; } }
        @keyframes ps-cardUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ps-tagFade { to { opacity: 1; } }
        @keyframes ps-lineReveal { to { opacity: 1; } }

        .ps-root {
          min-height: 100vh;
          background: #f5f0e8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }
        .ps-lines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .ps-line {
          position: absolute;
          top: 0; bottom: 0;
          width: 1px;
          background: rgba(180,150,100,0.12);
          animation: ps-lineReveal 1.2s ease forwards;
          opacity: 0;
        }
        .ps-line:nth-child(1) { left: 16.66%; }
        .ps-line:nth-child(2) { left: 33.33%; }
        .ps-line:nth-child(3) { left: 50%; }
        .ps-line:nth-child(4) { left: 66.66%; }
        .ps-line:nth-child(5) { left: 83.33%; }
        .ps-line:nth-child(6) { left: 5%; }

        .ps-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1060px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 32px 80px rgba(0,0,0,0.09);
          animation: ps-cardUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        /* LEFT */
        .ps-left {
          background: #1c1510;
          padding: 64px 56px;
          position: relative;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          min-height: 580px;
        }
        .ps-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 10% 80%, rgba(196,108,55,0.35) 0%, transparent 55%),
            radial-gradient(ellipse at 90% 10%, rgba(120,80,40,0.2) 0%, transparent 50%);
        }
        .ps-left::after {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 280px; height: 280px;
          border: 1.5px solid rgba(196,108,55,0.18);
          border-radius: 50%;
        }
        .ps-left-inner { position: relative; z-index: 1; width: 100%; }

        .ps-wordmark {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 40px 56px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ps-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #c46c37;
          display: block;
        }
        .ps-brand {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.04em;
        }

        .ps-hero-icon { margin-bottom: 28px; }

        .ps-eyebrow {
          font-size: 13px;
          color: #c46c37;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 14px;
          font-weight: 500;
        }
        .ps-display {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 4vw, 54px);
          font-weight: 900;
          color: #f5f0e8;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 36px;
        }

        .ps-dest-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .ps-dest-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .ps-dest-tag {
          display: inline-block;
          padding: 6px 14px;
          border: 1px solid rgba(196,108,55,0.35);
          border-radius: 99px;
          font-size: 12.5px;
          color: rgba(255,255,255,0.55);
          font-weight: 400;
          animation: ps-tagFade 0.5s ease forwards;
          opacity: 0;
          transition: border-color 0.2s, color 0.2s;
        }
        .ps-dest-tag:hover { border-color: #c46c37; color: rgba(255,255,255,0.85); }

        .ps-circle-deco {
          position: absolute;
          bottom: -80px; right: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          border: 1px solid rgba(196,108,55,0.15);
          pointer-events: none;
        }

        /* RIGHT */
        .ps-right {
          background: #faf7f2;
          padding: 64px 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ps-right-inner {
          width: 100%;
          max-width: 360px;
        }

        .ps-right-icon { margin-bottom: 28px; }

        .ps-right-eyebrow {
          font-size: 11.5px;
          font-weight: 600;
          color: #b5a898;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 10px;
        }
        .ps-right-title {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 700;
          color: #1c1510;
          letter-spacing: -0.02em;
          line-height: 1.18;
          margin-bottom: 16px;
        }
        .ps-right-sub {
          font-size: 14px;
          color: #9c8a74;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        /* Order pill */
        .ps-order-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: #f0ece4;
          border-radius: 12px;
          border: 1px solid #e5ddd2;
          margin-bottom: 32px;
        }
        .ps-order-label {
          font-size: 11px;
          font-weight: 600;
          color: #b5a898;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .ps-order-id {
          font-size: 13px;
          color: #3a3028;
          font-weight: 500;
          font-family: monospace;
        }

        /* Button */
        .ps-btn {
          width: 100%;
          height: 52px;
          border-radius: 12px;
          background: #1c1510;
          border: none;
          color: #f5f0e8;
          font-size: 15px;
          font-weight: 500;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
        }
        .ps-btn:hover {
          background: #c46c37;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(196,108,55,0.35);
        }
        .ps-btn svg { transition: transform 0.2s; }
        .ps-btn:hover svg { transform: translateX(4px); }

        /* Divider */
        .ps-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0;
        }
        .ps-divider span { flex: 1; height: 1px; background: #e5ddd2; display: block; }
        .ps-divider p { font-size: 12px; color: #b5a898; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.08em; }

        /* Responsive */
        @media (max-width: 900px) {
          .ps-card { grid-template-columns: 1fr; max-width: 460px; border-radius: 20px; }
          .ps-left { min-height: auto; padding: 36px 36px 44px; align-items: flex-start; }
          .ps-wordmark { position: relative; padding: 0; margin-bottom: 28px; }
          .ps-right { padding: 44px 36px 52px; }
          .ps-display { font-size: 36px; }
        }
        @media (max-width: 520px) {
          .ps-root { padding: 12px; align-items: flex-start; padding-top: 20px; }
          .ps-card { border-radius: 16px; }
          .ps-left { padding: 28px 24px 36px; }
          .ps-right { padding: 36px 24px 44px; }
          .ps-display { font-size: 30px; }
          .ps-right-title { font-size: 28px; }
        }
      `}</style>

      <div className="ps-root">
        <div className="ps-lines">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ps-line" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
        </div>

        <div className="ps-card">
          {/* LEFT */}
          <div className="ps-left">
            <div className="ps-left-inner">
              <div className="ps-wordmark">
                <span className="ps-dot" />
                <span className="ps-brand">Wandr</span>
              </div>

              <div className="ps-hero-icon">{c.icon}</div>
              <p className="ps-eyebrow">{c.eyebrow}</p>
              <h1 className="ps-display">{c.title}</h1>

              <div>
                <p className="ps-dest-label">Popular destinations</p>
                <div className="ps-dest-list">
                  {["Kyoto", "Santorini", "Marrakech", "Reykjavik"].map((d, i) => (
                    <span key={d} className="ps-dest-tag" style={{ animationDelay: `${0.6 + i * 0.15}s` }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="ps-circle-deco" />
          </div>

          {/* RIGHT */}
          <div className="ps-right">
            <div className="ps-right-inner">
              <div className="ps-right-icon">{c.icon}</div>

              <p className="ps-right-eyebrow">{c.eyebrow}</p>
              <h2 className="ps-right-title">{c.title}</h2>
              <p className="ps-right-sub">{c.sub}</p>

              {status === "success" && orderId && (
                <div className="ps-order-pill">
                  <span className="ps-order-label">Order ID</span>
                  <span className="ps-order-id">{orderId}</span>
                </div>
              )}

              {status === "verifying" && (
                <div className="ps-divider">
                  <span /><p>processing</p><span />
                </div>
              )}

              {c.btnLabel && (
                <button className="ps-btn" onClick={() => navigate("/home")}>
                  <span>{c.btnLabel}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;