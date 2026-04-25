import { useState } from "react";
import axios from "axios";

const AddOffers = () => {
  const initialState = {
    title: "",
    description: "",
    couponCode: "",
    discountType: "FLAT",
    discountValue: "",
    minAmount: "",
    expiryDate: "",
  };

  const [form, setForm] = useState(initialState);
  const [focused, setFocused] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post("https://travel-backend-83lh.onrender.com/admin/add-offers", form);
      alert("🎉 Offer Added Successfully");
      setForm(initialState);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add offer");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = form.title && form.couponCode && form.discountValue && form.expiryDate;

  const Field = ({ label, name, children, half }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }} className={`ao-field ${focused === name ? "ao-on" : ""}`}>
      <label style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: focused === name ? "#c46c37" : "#9c8a74",
        transition: "color 0.2s",
        fontFamily: "'Outfit', sans-serif",
      }}>{label}</label>
      {children}
      <span className="ao-underline" />
    </div>
  );

  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1.5px solid #ddd5c5",
    padding: "10px 0",
    fontSize: 15,
    color: "#1c1510",
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes ao-cardUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ao-lineReveal { to { opacity: 1; } }
        @keyframes ao-spin { to { transform: rotate(360deg); } }

        .ao-root {
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

        .ao-lines {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
        }
        .ao-line {
          position: absolute; top: 0; bottom: 0;
          width: 1px;
          background: rgba(180,150,100,0.12);
          animation: ao-lineReveal 1.2s ease forwards;
          opacity: 0;
        }
        .ao-line:nth-child(1) { left: 16.66%; }
        .ao-line:nth-child(2) { left: 33.33%; }
        .ao-line:nth-child(3) { left: 50%; }
        .ao-line:nth-child(4) { left: 66.66%; }
        .ao-line:nth-child(5) { left: 83.33%; }
        .ao-line:nth-child(6) { left: 5%; }

        /* Card */
        .ao-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 1060px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 32px 80px rgba(0,0,0,0.09);
          animation: ao-cardUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        /* LEFT */
        .ao-left {
          background: #1c1510;
          padding: 64px 56px;
          position: relative;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          min-height: 620px;
        }
        .ao-left::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 10% 80%, rgba(196,108,55,0.35) 0%, transparent 55%),
            radial-gradient(ellipse at 90% 10%, rgba(120,80,40,0.2) 0%, transparent 50%);
        }
        .ao-left::after {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 280px; height: 280px;
          border: 1.5px solid rgba(196,108,55,0.18);
          border-radius: 50%;
        }
        .ao-left-inner { position: relative; z-index: 1; width: 100%; }

        .ao-wordmark {
          position: absolute; top: 0; left: 0; right: 0;
          padding: 40px 56px;
          display: flex; align-items: center; gap: 10px;
        }
        .ao-dot {
          width: 10px; height: 10px;
          border-radius: 50%; background: #c46c37;
        }
        .ao-brand {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.04em;
        }

        .ao-eyebrow {
          font-size: 13px; color: #c46c37;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 16px; font-weight: 500;
        }
        .ao-display {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 4vw, 54px);
          font-weight: 900;
          color: #f5f0e8;
          line-height: 1.12;
          letter-spacing: -0.02em;
          margin-bottom: 40px;
        }
        .ao-display-stroke {
          -webkit-text-stroke: 1.5px #c46c37;
          color: transparent;
        }

        /* Stats */
        .ao-stats {
          display: flex; gap: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(196,108,55,0.18);
          margin-bottom: 0;
        }
        .ao-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700;
          color: #f5f0e8;
        }
        .ao-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.1em; margin-top: 2px;
        }

        .ao-badge {
          display: inline-flex; align-items: center;
          gap: 6px; padding: 6px 14px;
          border: 1px solid rgba(196,108,55,0.35);
          border-radius: 99px;
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 28px;
        }
        .ao-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%; background: #c46c37;
        }

        .ao-circle-deco {
          position: absolute;
          bottom: -80px; right: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          border: 1px solid rgba(196,108,55,0.15);
          pointer-events: none;
        }

        /* RIGHT */
        .ao-right {
          background: #faf7f2;
          padding: 56px 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
        }
        .ao-form-wrap {
          width: 100%; max-width: 360px;
        }
        .ao-form-header { margin-bottom: 32px; }
        .ao-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 700;
          color: #1c1510;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .ao-form-sub {
          font-size: 14px; color: #9c8a74;
        }

        /* Form */
        .ao-form { display: flex; flex-direction: column; gap: 24px; }

        /* Field underline animation */
        .ao-underline {
          display: block; height: 2px;
          background: linear-gradient(90deg, #c46c37, #e8924a);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          margin-top: -1.5px;
        }
        .ao-on .ao-underline { transform: scaleX(1); }

        /* Row */
        .ao-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* Select */
        .ao-select {
          -webkit-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23b5a898' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 4px center;
          padding-right: 24px !important;
          cursor: pointer;
        }
        .ao-select option { background: #faf7f2; color: #1c1510; }

        /* Textarea */
        .ao-textarea {
          resize: none;
          height: 76px;
        }

        /* Submit */
        .ao-submit {
          height: 52px;
          border: 1.5px solid #ddd5c5;
          border-radius: 12px;
          background: transparent;
          color: #b5a898;
          font-size: 15px; font-weight: 500;
          font-family: 'Outfit', sans-serif;
          cursor: not-allowed;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          transition: all 0.3s;
          margin-top: 4px;
          width: 100%;
        }
        .ao-submit-active {
          background: #1c1510;
          border-color: #1c1510;
          color: #f5f0e8;
          cursor: pointer;
        }
        .ao-submit-active:hover {
          background: #c46c37;
          border-color: #c46c37;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(196,108,55,0.35);
        }
        .ao-submit-active:hover .ao-arrow { transform: translateX(4px); }
        .ao-arrow { transition: transform 0.2s; }
        .ao-spinner { animation: ao-spin 0.8s linear infinite; }

        /* Responsive */
        @media (max-width: 900px) {
          .ao-card { grid-template-columns: 1fr; max-width: 480px; border-radius: 20px; }
          .ao-left { min-height: auto; padding: 36px 36px 44px; align-items: flex-start; }
          .ao-wordmark { position: relative; padding: 0; margin-bottom: 28px; }
          .ao-right { padding: 44px 36px 52px; }
          .ao-display { font-size: 36px; }
        }
        @media (max-width: 520px) {
          .ao-root { padding: 12px; align-items: flex-start; padding-top: 20px; }
          .ao-card { border-radius: 16px; }
          .ao-left { padding: 28px 24px 36px; }
          .ao-right { padding: 36px 24px 44px; }
          .ao-display { font-size: 30px; }
          .ao-form-title { font-size: 26px; }
          .ao-row { grid-template-columns: 1fr; gap: 24px; }
          .ao-form { gap: 20px; }
        }
        @media (max-width: 360px) {
          .ao-left { padding: 24px 18px 30px; }
          .ao-right { padding: 28px 18px 36px; }
        }
      `}</style>

      <div className="ao-root">
        <div className="ao-lines">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ao-line" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
        </div>

        <div className="ao-card">

          {/* LEFT */}
          <div className="ao-left">
            <div className="ao-left-inner">
              <div className="ao-wordmark">
                <span className="ao-dot" />
                <span className="ao-brand">BusGo</span>
              </div>

              <div className="ao-badge">
                <span className="ao-badge-dot" />
                Admin Panel
              </div>

              <p className="ao-eyebrow">Manage offers</p>
              <h1 className="ao-display">
                Create deals<br />
                that drive<br />
                <span className="ao-display-stroke">bookings.</span>
              </h1>

              <div className="ao-stats">
                <div>
                  <div className="ao-stat-num">12</div>
                  <div className="ao-stat-label">Active Offers</div>
                </div>
                <div>
                  <div className="ao-stat-num">3.4k</div>
                  <div className="ao-stat-label">Redemptions</div>
                </div>
                <div>
                  <div className="ao-stat-num">₹2L+</div>
                  <div className="ao-stat-label">Savings Given</div>
                </div>
              </div>
            </div>
            <div className="ao-circle-deco" />
          </div>

          {/* RIGHT */}
          <div className="ao-right">
            <div className="ao-form-wrap">
              <div className="ao-form-header">
                <h2 className="ao-form-title">New Offer</h2>
                <p className="ao-form-sub">Fill in the details to create a discount</p>
              </div>

              <form className="ao-form" onSubmit={handleSubmit} noValidate>

                <Field label="Offer Title" name="title">
                  <input
                    style={inputStyle}
                    name="title"
                    placeholder="New Year Discount"
                    value={form.title}
                    onChange={handleChange}
                    onFocus={() => setFocused("title")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                </Field>

                <Field label="Description" name="description">
                  <textarea
                    style={{ ...inputStyle, resize: "none", height: 72 }}
                    className="ao-textarea"
                    name="description"
                    placeholder="Applicable on selected routes"
                    value={form.description}
                    onChange={handleChange}
                    onFocus={() => setFocused("description")}
                    onBlur={() => setFocused(null)}
                  />
                </Field>

                <div className="ao-row">
                  <Field label="Coupon Code" name="couponCode">
                    <input
                      style={{ ...inputStyle, textTransform: "uppercase", letterSpacing: "0.06em" }}
                      name="couponCode"
                      placeholder="NEWYEAR50"
                      value={form.couponCode}
                      onChange={handleChange}
                      onFocus={() => setFocused("couponCode")}
                      onBlur={() => setFocused(null)}
                      required
                    />
                  </Field>

                  <Field label="Discount Type" name="discountType">
                    <select
                      style={inputStyle}
                      className="ao-select"
                      name="discountType"
                      value={form.discountType}
                      onChange={handleChange}
                      onFocus={() => setFocused("discountType")}
                      onBlur={() => setFocused(null)}
                    >
                      <option value="FLAT">Flat (₹)</option>
                      <option value="PERCENT">Percent (%)</option>
                    </select>
                  </Field>
                </div>

                <div className="ao-row">
                  <Field label="Discount Value" name="discountValue">
                    <input
                      style={inputStyle}
                      name="discountValue"
                      type="number"
                      placeholder="50"
                      value={form.discountValue}
                      onChange={handleChange}
                      onFocus={() => setFocused("discountValue")}
                      onBlur={() => setFocused(null)}
                      required
                    />
                  </Field>

                  <Field label="Min. Booking Amount" name="minAmount">
                    <input
                      style={inputStyle}
                      name="minAmount"
                      type="number"
                      placeholder="500"
                      value={form.minAmount}
                      onChange={handleChange}
                      onFocus={() => setFocused("minAmount")}
                      onBlur={() => setFocused(null)}
                    />
                  </Field>
                </div>

                <Field label="Expiry Date" name="expiryDate">
                  <input
                    style={inputStyle}
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    onFocus={() => setFocused("expiryDate")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                </Field>

                <button
                  type="submit"
                  className={`ao-submit ${isValid ? "ao-submit-active" : ""}`}
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="ao-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      <span>Adding Offer...</span>
                    </>
                  ) : (
                    <>
                      <span>Add Offer</span>
                      <svg className="ao-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddOffers;