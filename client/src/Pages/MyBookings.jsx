import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    axios
      .get("https://travel-backend-83lh.onrender.com/api/bookings/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => { setBookings(res.data.bookings); setIsLoading(false); })
      .catch((err) => { console.error(err); setError("Failed to load bookings."); setIsLoading(false); });
  }, [token]);

  const downloadPDF = (b) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("BUS TICKET CONFIRMATION", 14, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${b.orderId}`, 14, 30);
    doc.text("Status: CONFIRMED", 14, 38);
    autoTable(doc, {
      startY: 45,
      head: [["Field", "Details"]],
      body: [
        ["Bus Name", b.busId.travelname],
        ["Route", `${b.busId.from} → ${b.busId.to}`],
        ["Travel Date", new Date(b.travelDate).toDateString()],
        ["Departure", b.busId.departure_time],
        ["Arrival", b.busId.arrival_time],
        ["Seats", b.seats.join(", ")],
        ["Fare", `₹${b.totalFare}`],
        ["Driver", b.busId.driver_name],
        ["Contact", b.busId.contact_number],
      ],
    });
    doc.text("Happy Journey! Thank you for booking with BusGo.", 14, doc.lastAutoTable.finalY + 15);
    doc.save(`Ticket_${b.orderId}.pdf`);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes mb-cardUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mb-lineReveal { to { opacity: 1; } }
        @keyframes mb-spin       { to { transform: rotate(360deg); } }
        @keyframes mb-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* ── PAGE ── */
        .mb-root {
          min-height: 100vh;
          background: #f5f0e8;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow-x: hidden;
          padding: 52px 24px 72px;
        }
        .mb-root::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse at 5% 90%, rgba(196,108,55,0.14) 0%, transparent 50%),
            radial-gradient(ellipse at 95% 5%,  rgba(120,80,40,0.10) 0%, transparent 45%);
          pointer-events: none; z-index: 0;
        }

        /* BG lines */
        .mb-lines {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
        }
        .mb-line {
          position: absolute; top: 0; bottom: 0;
          width: 1px; background: rgba(180,150,100,0.10);
          animation: mb-lineReveal 1.2s ease forwards; opacity: 0;
        }
        .mb-line:nth-child(1) { left: 16.66%; }
        .mb-line:nth-child(2) { left: 33.33%; }
        .mb-line:nth-child(3) { left: 50%; }
        .mb-line:nth-child(4) { left: 66.66%; }
        .mb-line:nth-child(5) { left: 83.33%; }

        /* ── INNER WRAP ── */
        .mb-wrap {
          position: relative; z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }

        /* ── PAGE HEADER ── */
        .mb-header {
          margin-bottom: 48px;
          animation: mb-cardUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .mb-wordmark {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 20px;
        }
        .mb-dot {
          width: 8px; height: 8px;
          border-radius: 50%; background: #c46c37;
        }
        .mb-brand {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 700;
          color: #c46c37; letter-spacing: 0.06em;
        }
        .mb-eyebrow {
          font-size: 12px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em;
          color: #b5a898; margin-bottom: 10px;
        }
        .mb-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 900; color: #1c1510;
          line-height: 1.1; letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .mb-title-stroke {
          -webkit-text-stroke: 1.5px #c46c37;
          color: transparent;
        }
        .mb-subtitle {
          font-size: 15px; color: #9c8a74;
        }

        /* ── STATES ── */
        .mb-state {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 80px 20px; text-align: center;
          background: #faf7f2;
          border-radius: 20px;
          border: 1px solid #e5ddd2;
        }
        .mb-state-icon {
          font-size: 48px; margin-bottom: 16px;
          animation: mb-pulse 2s ease-in-out infinite;
          color: #c46c37;
        }
        .mb-state p {
          font-size: 17px; font-weight: 600; color: #1c1510; margin-bottom: 6px;
        }
        .mb-state span {
          font-size: 14px; color: #9c8a74;
        }
        .mb-spinner {
          width: 40px; height: 40px;
          border: 2.5px solid #e5ddd2;
          border-top-color: #c46c37;
          border-radius: 50%;
          animation: mb-spin 0.8s linear infinite;
          margin-bottom: 16px;
        }
        .mb-error-bar {
          background: #fef3ee; border: 1px solid #f5c4a8;
          border-radius: 12px; padding: 14px 18px;
          font-size: 14px; color: #b34a1a;
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 8px;
        }

        /* ── BOOKING COUNT PILL ── */
        .mb-count-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px;
          border: 1px solid rgba(196,108,55,0.35);
          border-radius: 99px;
          font-size: 12px; color: #9c8a74;
          margin-top: 14px;
        }
        .mb-count-pill span { color: #c46c37; font-weight: 600; }

        /* ── BOOKINGS LIST ── */
        .mb-list {
          display: flex; flex-direction: column; gap: 20px;
        }

        /* ── TICKET CARD ── */
        .mb-ticket {
          background: #faf7f2;
          border-radius: 20px;
          border: 1px solid #e5ddd2;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05);
          transition: box-shadow 0.3s, transform 0.3s;
          animation: mb-cardUp 0.6s cubic-bezier(0.22,1,0.36,1) backwards;
        }
        .mb-ticket:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06), 0 16px 40px rgba(196,108,55,0.10);
        }

        /* ticket top strip */
        .mb-ticket-top {
          background: #1c1510;
          padding: 20px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .mb-ticket-top::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 5% 80%, rgba(196,108,55,0.3) 0%, transparent 60%);
        }
        .mb-ticket-top::after {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 140px; height: 140px;
          border: 1px solid rgba(196,108,55,0.15);
          border-radius: 50%;
        }

        .mb-route {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 12px;
        }
        .mb-city {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #f5f0e8; letter-spacing: -0.01em;
        }
        .mb-route-arrow {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
        }
        .mb-route-line {
          width: 48px; height: 1px; background: rgba(196,108,55,0.5);
        }
        .mb-route-dot {
          width: 6px; height: 6px;
          border-radius: 50%; background: #c46c37;
        }

        .mb-ticket-meta {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
        }
        .mb-fare {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 700; color: #f5f0e8;
        }
        .mb-status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          background: rgba(46,125,50,0.2);
          color: #6fcf76;
          border: 1px solid rgba(46,125,50,0.3);
        }
        .mb-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%; background: #6fcf76;
        }

        /* ticket bottom body */
        .mb-ticket-body {
          padding: 22px 28px 24px;
        }

        /* perforated divider */
        .mb-perforation {
          display: flex; align-items: center; gap: 0;
          margin: 0 -28px 22px;
          position: relative;
        }
        .mb-perf-circle {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #f5f0e8;
          border: 1px solid #e5ddd2;
          flex-shrink: 0;
        }
        .mb-perf-circle:first-child { margin-left: -10px; }
        .mb-perf-circle:last-child  { margin-right: -10px; }
        .mb-perf-line {
          flex: 1;
          border-top: 1.5px dashed #ddd5c5;
        }

        /* info grid */
        .mb-info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        .mb-info-item {}
        .mb-info-label {
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: #b5a898; margin-bottom: 4px;
        }
        .mb-info-val {
          font-size: 14px; font-weight: 500; color: #1c1510;
        }

        /* seats row */
        .mb-seats-row {
          display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap; margin-bottom: 20px;
        }
        .mb-seats-label {
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: #b5a898;
        }
        .mb-seat-chip {
          display: inline-flex; align-items: center;
          padding: 3px 10px;
          border-radius: 6px;
          background: rgba(196,108,55,0.1);
          border: 1px solid rgba(196,108,55,0.25);
          font-size: 12px; font-weight: 600;
          color: #c46c37; letter-spacing: 0.04em;
        }

        /* order id + download row */
        .mb-ticket-footer {
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #e5ddd2;
        }
        .mb-order-id {
          font-size: 11px; color: #b5a898;
        }
        .mb-order-id code {
          font-family: monospace;
          font-size: 12px; color: #7a6e63;
          letter-spacing: 0.04em;
        }

        /* download button */
        .mb-download-btn {
          display: inline-flex; align-items: center; gap: 8px;
          height: 40px; padding: 0 18px;
          border-radius: 10px;
          background: #1c1510;
          border: none; color: #f5f0e8;
          font-size: 13px; font-weight: 500;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          white-space: nowrap;
        }
        .mb-download-btn:hover {
          background: #c46c37;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(196,108,55,0.3);
        }
        .mb-download-btn svg {
          transition: transform 0.2s;
        }
        .mb-download-btn:hover svg {
          transform: translateY(2px);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .mb-root { padding: 36px 16px 52px; }
          .mb-info-grid { grid-template-columns: repeat(2, 1fr); }
          .mb-ticket-top { padding: 16px 20px; }
          .mb-ticket-body { padding: 18px 20px 20px; }
          .mb-perforation { margin: 0 -20px 18px; }
          .mb-city { font-size: 18px; }
          .mb-fare { font-size: 20px; }
        }
        @media (max-width: 480px) {
          .mb-title { font-size: 30px; }
          .mb-route-line { width: 30px; }
          .mb-info-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .mb-ticket-footer { flex-direction: column; align-items: flex-start; gap: 10px; }
          .mb-download-btn { width: 100%; justify-content: center; }
          .mb-city { font-size: 16px; }
        }
        @media (max-width: 360px) {
          .mb-root { padding: 28px 12px 44px; }
          .mb-ticket-top { padding: 14px 16px; }
          .mb-ticket-body { padding: 16px 16px 18px; }
          .mb-perforation { margin: 0 -16px 16px; }
        }
      `}</style>

      <div className="mb-root">
        <div className="mb-lines">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="mb-line" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>

        <div className="mb-wrap">

          {/* Page Header */}
          <div className="mb-header">
            <div className="mb-wordmark">
              <span className="mb-dot" />
              <span className="mb-brand">BusGo</span>
            </div>
            <p className="mb-eyebrow">Travel history</p>
            <h1 className="mb-title">
              My<br />
              <span className="mb-title-stroke">Bookings.</span>
            </h1>
            <p className="mb-subtitle">All your confirmed journeys in one place.</p>
            {!isLoading && bookings.length > 0 && (
              <div className="mb-count-pill">
                <span>{bookings.length}</span> booking{bookings.length !== 1 ? "s" : ""} found
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-error-bar">⚠ {error}</div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="mb-state">
              <div className="mb-spinner" />
              <p>Loading your bookings...</p>
              <span>Just a moment</span>
            </div>
          )}

          {/* No token */}
          {!token && !isLoading && (
            <div className="mb-state">
              <div className="mb-state-icon">🔒</div>
              <p>Sign in to view bookings</p>
              <span>Your travel history will appear here after login.</span>
            </div>
          )}

          {/* Empty */}
          {token && !isLoading && bookings.length === 0 && !error && (
            <div className="mb-state">
              <div className="mb-state-icon">🎟</div>
              <p>No bookings yet</p>
              <span>Your confirmed tickets will show up here.</span>
            </div>
          )}

          {/* Booking Cards */}
          {!isLoading && bookings.length > 0 && (
            <div className="mb-list">
              {bookings.map((b, index) => (
                <div
                  key={b._id}
                  className="mb-ticket"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* Top strip */}
                  <div className="mb-ticket-top">
                    <div className="mb-route">
                      <span className="mb-city">{b.busId.from}</span>
                      <div className="mb-route-arrow">
                        <div className="mb-route-dot" />
                        <div className="mb-route-line" />
                        <div className="mb-route-dot" />
                      </div>
                      <span className="mb-city">{b.busId.to}</span>
                    </div>
                    <div className="mb-ticket-meta">
                      <span className="mb-fare">₹{b.totalFare}</span>
                      <span className="mb-status-badge">
                        <span className="mb-status-dot" />
                        Confirmed
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mb-ticket-body">
                    {/* Perforation line */}
                    <div className="mb-perforation">
                      <div className="mb-perf-circle" />
                      <div className="mb-perf-line" />
                      <div className="mb-perf-circle" />
                    </div>

                    {/* Info grid */}
                    <div className="mb-info-grid">
                      <div className="mb-info-item">
                        <div className="mb-info-label">Bus</div>
                        <div className="mb-info-val">{b.busId.travelname}</div>
                      </div>
                      <div className="mb-info-item">
                        <div className="mb-info-label">Travel Date</div>
                        <div className="mb-info-val">{formatDate(b.travelDate)}</div>
                      </div>
                      <div className="mb-info-item">
                        <div className="mb-info-label">Departure</div>
                        <div className="mb-info-val">{b.busId.departure_time}</div>
                      </div>
                      <div className="mb-info-item">
                        <div className="mb-info-label">Arrival</div>
                        <div className="mb-info-val">{b.busId.arrival_time}</div>
                      </div>
                    </div>

                    {/* Seats */}
                    <div className="mb-seats-row">
                      <span className="mb-seats-label">Seats:</span>
                      {b.seats.map((s) => (
                        <span key={s} className="mb-seat-chip">{s}</span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mb-ticket-footer">
                      <div className="mb-order-id">
                        Order ID: <code>{b.orderId}</code>
                      </div>
                      <button className="mb-download-btn" onClick={() => downloadPDF(b)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default MyBookings;