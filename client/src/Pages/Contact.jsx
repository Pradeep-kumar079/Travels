import React, { useState } from "react";
import "./Contact.css";
import { FiArrowRight, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  const isFormValid = formData.name && formData.email && formData.message;

  const contactItems = [
    { icon: <FiMail />, key: "Email", val: "support@travelapp.com" },
    { icon: <FiPhone />, key: "Phone", val: "+91 93531 98519" },
    { icon: <FiMapPin />, key: "Location", val: "Karnataka, India" },
  ];

  return (
    <div className="ct-root">
      <div className="ct-card">

        {/* LEFT — Dark typographic panel */}
        <div className="ct-left">
          <div className="ct-left-inner">

            <div className="ct-wordmark">
              <span className="ct-dot" />
              <span className="ct-brand">Wandr</span>
            </div>

            <div className="ct-hero-text">
              <p className="ct-eyebrow">We'd love to hear,</p>
              <h1 className="ct-display">
                Let's talk<br />
                about your<br />
                <span className="ct-display-stroke">journey.</span>
              </h1>
            </div>

            <div>
              <p className="ct-info-label">Reach us directly</p>
              <div className="ct-info-list">
                {contactItems.map((item) => (
                  <div key={item.key} className="ct-info-item">
                    <div className="ct-info-icon">{item.icon}</div>
                    <div className="ct-info-content">
                      <span className="ct-info-key">{item.key}</span>
                      <span className="ct-info-val">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ct-circle-deco" />
          </div>
        </div>

        {/* RIGHT — Contact form */}
        <div className="ct-right">
          <div className="ct-form-wrap">

            <div className="ct-form-header">
              <h2 className="ct-form-title">Send a message</h2>
              <p className="ct-form-sub">We typically reply within 24 hours.</p>
            </div>

            {submitted && (
              <div className="ct-success">
                <span>✓</span> Message sent! We'll be in touch soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="ct-form" noValidate>

              {/* Name */}
              <div className={`ct-field ${focusedField === "name" ? "ct-field--on" : ""}`}>
                <label className="ct-label">Your name</label>
                <input
                  className="ct-input"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <span className="ct-underline" />
              </div>

              {/* Email */}
              <div className={`ct-field ${focusedField === "email" ? "ct-field--on" : ""}`}>
                <label className="ct-label">Email address</label>
                <input
                  className="ct-input"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <span className="ct-underline" />
              </div>

              {/* Message */}
              <div className={`ct-field ${focusedField === "message" ? "ct-field--on" : ""}`}>
                <label className="ct-label">Message</label>
                <textarea
                  className="ct-textarea"
                  name="message"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  rows={4}
                  required
                />
                <span className="ct-underline" />
              </div>

              {/* Submit */}
              <button
                className={`ct-submit ${isFormValid ? "ct-submit--active" : ""}`}
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="ct-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send message</span>
                    <FiArrowRight className="ct-arrow" />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;