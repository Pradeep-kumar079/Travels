import React, { useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");

  const user = {
    name: "Pradeep Kumar",
    role: "Full Stack Developer",
    email: "pradeepk9348@gmail.com",
    phone: "+91 93531 98519",
    location: "Karnataka, India",
    joined: "January 2023",
    trips: 12,
    wishlist: 5,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .pf-root {
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

        /* BG lines */
        .pf-lines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .pf-line {
          position: absolute;
          top: 0; bottom: 0;
          width: 1px;
          background: rgba(180,150,100,0.12);
        }
        .pf-line:nth-child(1) { left: 16.66%; }
        .pf-line:nth-child(2) { left: 33.33%; }
        .pf-line:nth-child(3) { left: 50%; }
        .pf-line:nth-child(4) { left: 66.66%; }
        .pf-line:nth-child(5) { left: 83.33%; }
        .pf-line:nth-child(6) { left: 5%; }

        /* Card */
        .pf-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1060px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 32px 80px rgba(0,0,0,0.09);
          animation: cardUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes cardUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* LEFT */
        .pf-left {
          background: #1c1510;
          padding: 64px 56px;
          position: relative;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          min-height: 600px;
        }
        .pf-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 10% 80%, rgba(196,108,55,0.35) 0%, transparent 55%),
            radial-gradient(ellipse at 90% 10%, rgba(120,80,40,0.2) 0%, transparent 50%);
        }
        .pf-left::after {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 280px; height: 280px;
          border: 1.5px solid rgba(196,108,55,0.18);
          border-radius: 50%;
        }
        .pf-left-inner {
          position: relative;
          z-index: 1;
          width: 100%;
        }

        /* Wordmark */
        .pf-wordmark {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 40px 56px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pf-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #c46c37;
          display: block;
        }
        .pf-brand {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.04em;
        }

        /* Avatar area */
        .pf-avatar-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 36px;
        }
        .pf-avatar-ring {
          width: 96px; height: 96px;
          border-radius: 50%;
          border: 2px solid rgba(196,108,55,0.5);
          padding: 3px;
          margin-bottom: 20px;
        }
        .pf-avatar {
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
          background: #2e2016;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-family: 'Playfair Display', serif;
          color: #c46c37;
          font-weight: 700;
        }
        .pf-eyebrow {
          font-size: 13px;
          color: #c46c37;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .pf-display {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 900;
          color: #f5f0e8;
          line-height: 1.12;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .pf-subrole {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          font-weight: 400;
        }

        /* Stats */
        .pf-stats {
          display: flex;
          gap: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(196,108,55,0.18);
        }
        .pf-stat-item {}
        .pf-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #f5f0e8;
        }
        .pf-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 2px;
        }

        .pf-circle-deco {
          position: absolute;
          bottom: -80px; right: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          border: 1px solid rgba(196,108,55,0.15);
          pointer-events: none;
        }

        /* RIGHT */
        .pf-right {
          background: #faf7f2;
          padding: 64px 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pf-right-inner {
          width: 100%;
          max-width: 360px;
        }

        /* Tabs */
        .pf-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 36px;
          border-bottom: 1.5px solid #e5ddd2;
        }
        .pf-tab {
          flex: 1;
          padding: 12px 0;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #b5a898;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
          background: none;
          border: none;
          font-family: 'Outfit', sans-serif;
        }
        .pf-tab::after {
          content: '';
          position: absolute;
          bottom: -1.5px; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #c46c37, #e8924a);
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .pf-tab.active {
          color: #c46c37;
        }
        .pf-tab.active::after {
          transform: scaleX(1);
        }

        /* Detail rows */
        .pf-detail-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
          margin-bottom: 36px;
        }
        .pf-detail {
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
          padding-bottom: 22px;
          border-bottom: 1px solid #f0e9df;
        }
        .pf-detail:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .pf-detail-label {
          font-size: 11px;
          font-weight: 600;
          color: #b5a898;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .pf-detail-val {
          font-size: 15px;
          color: #1c1510;
          font-weight: 400;
        }

        /* Action buttons */
        .pf-actions {
          display: flex;
          gap: 12px;
        }
        .pf-btn {
          flex: 1;
          height: 50px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s;
        }
        .pf-btn-primary {
          background: #1c1510;
          border: none;
          color: #f5f0e8;
        }
        .pf-btn-primary:hover {
          background: #c46c37;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(196,108,55,0.35);
        }
        .pf-btn-outline {
          background: transparent;
          border: 1.5px solid #ddd5c5;
          color: #7a6e63;
        }
        .pf-btn-outline:hover {
          border-color: #c9bfb2;
          background: #f0ece4;
          transform: translateY(-1px);
        }

        /* Joined badge */
        .pf-joined {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: 1px solid rgba(196,108,55,0.35);
          border-radius: 99px;
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          margin-top: 16px;
        }
        .pf-joined-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c46c37;
          display: block;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .pf-card {
            grid-template-columns: 1fr;
            max-width: 460px;
            border-radius: 20px;
          }
          .pf-left {
            min-height: auto;
            padding: 36px 36px 44px;
            align-items: flex-start;
          }
          .pf-wordmark {
            position: relative;
            padding: 0;
            margin-bottom: 28px;
          }
          .pf-right {
            padding: 44px 36px 52px;
          }
          .pf-display { font-size: 34px; }
        }
        @media (max-width: 520px) {
          .pf-root { padding: 12px; align-items: flex-start; padding-top: 20px; }
          .pf-card { border-radius: 16px; }
          .pf-left { padding: 28px 24px 36px; }
          .pf-right { padding: 36px 24px 44px; }
          .pf-display { font-size: 28px; }
          .pf-avatar-ring { width: 80px; height: 80px; }
        }
      `}</style>

      <div className="pf-root">
        <div className="pf-lines">
          {[...Array(6)].map((_, i) => <div key={i} className="pf-line" />)}
        </div>

        <div className="pf-card">
          {/* LEFT */}
          <div className="pf-left">
            <div className="pf-left-inner">
              <div className="pf-wordmark">
                <span className="pf-dot" />
                <span className="pf-brand">Wandr</span>
              </div>

              <div className="pf-avatar-wrap">
                <div className="pf-avatar-ring">
                  <div className="pf-avatar">PK</div>
                </div>
                <p className="pf-eyebrow">Member Profile</p>
                <h1 className="pf-display">{user.name}</h1>
                <p className="pf-subrole">{user.role}</p>
                <div className="pf-joined">
                  <span className="pf-joined-dot" />
                  Member since {user.joined}
                </div>
              </div>

              <div className="pf-stats">
                <div className="pf-stat-item">
                  <div className="pf-stat-num">{user.trips}</div>
                  <div className="pf-stat-label">Trips</div>
                </div>
                <div className="pf-stat-item">
                  <div className="pf-stat-num">{user.wishlist}</div>
                  <div className="pf-stat-label">Wishlist</div>
                </div>
                <div className="pf-stat-item">
                  <div className="pf-stat-num">4.9</div>
                  <div className="pf-stat-label">Rating</div>
                </div>
              </div>
            </div>
            <div className="pf-circle-deco" />
          </div>

          {/* RIGHT */}
          <div className="pf-right">
            <div className="pf-right-inner">
              <div className="pf-tabs">
                {["info", "security"].map(tab => (
                  <button
                    key={tab}
                    className={`pf-tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "info" ? "Profile" : "Security"}
                  </button>
                ))}
              </div>

              {activeTab === "info" ? (
                <div className="pf-detail-list">
                  {[
                    { label: "Full Name", val: user.name },
                    { label: "Email Address", val: user.email },
                    { label: "Phone Number", val: user.phone },
                    { label: "Location", val: user.location },
                  ].map(({ label, val }) => (
                    <div className="pf-detail" key={label}>
                      <span className="pf-detail-label">{label}</span>
                      <span className="pf-detail-val">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pf-detail-list">
                  {[
                    { label: "Password", val: "••••••••••••" },
                    { label: "Two-Factor Auth", val: "Not enabled" },
                    { label: "Last Login", val: "Today, 9:41 AM" },
                    { label: "Sessions", val: "2 active devices" },
                  ].map(({ label, val }) => (
                    <div className="pf-detail" key={label}>
                      <span className="pf-detail-label">{label}</span>
                      <span className="pf-detail-val">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pf-actions">
                <button className="pf-btn pf-btn-primary">Edit Profile</button>
                <button className="pf-btn pf-btn-outline">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;