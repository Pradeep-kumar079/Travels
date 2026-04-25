import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCopy, FiCheck, FiCalendar, FiPercent, FiDollarSign, FiTag } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import "./Offers.css";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("https://travel-backend-83lh.onrender.com/admin/offers");
      console.log("Offers API response:", res.data);
      setOffers(res.data || []);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch offers:", error.response?.data || error.message);
      setError("Failed to load offers. Please try again later.");
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOfferActive = (expiryDate) => {
    return new Date(expiryDate) > new Date();
  };

  return (
    <div className="offers-root">
      {/* Decorative background */}
      <div className="offers-bg-lines">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="offers-bg-line" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>

      <div className="offers-container">
        {/* Header */}
        <div className="offers-header">
          <div className="offers-header-content">
            <FiTag className="offers-header-icon" />
            <h1 className="offers-title">Special Offers</h1>
            <p className="offers-subtitle">Exclusive deals and discounts on your bookings</p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="offers-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="offers-loading">
            <FaSpinner className="offers-spin" />
            <p>Loading amazing offers...</p>
          </div>
        )}

        {/* No Offers State */}
        {!isLoading && offers.length === 0 && !error && (
          <div className="offers-empty">
            <FiTag className="offers-empty-icon" />
            <p>No offers available right now</p>
            <span>Check back soon for exclusive deals!</span>
          </div>
        )}

        {/* Offers Grid */}
        {!isLoading && offers.length > 0 && (
          <div className="offers-grid">
            {offers.map((offer, index) => {
              const active = isOfferActive(offer.expiryDate);
              const isFlat = offer.discountType === "FLAT";

              return (
                <div
                  key={offer._id}
                  className={`offers-card ${!active ? "offers-card--expired" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Status Badge */}
                  <div className={`offers-badge ${active ? "offers-badge--active" : "offers-badge--expired"}`}>
                    {active ? "Active" : "Expired"}
                  </div>

                  {/* Discount Icon */}
                  <div className="offers-discount-box">
                    {isFlat ? (
                      <>
                        <FiDollarSign className="offers-icon-main" />
                        <span className="offers-discount-value">{offer.discountValue}</span>
                      </>
                    ) : (
                      <>
                        <FiPercent className="offers-icon-main" />
                        <span className="offers-discount-value">{offer.discountValue}</span>
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="offers-content">
                    <h3 className="offers-card-title">{offer.title}</h3>
                    <p className="offers-description">{offer.description}</p>

                    {/* Discount Info */}
                    <div className="offers-discount-info">
                      <span className="offers-discount-badge">
                        {isFlat ? `Flat ₹${offer.discountValue} OFF` : `${offer.discountValue}% OFF`}
                      </span>
                    </div>

                    {/* Min Amount */}
                    {offer.minAmount && (
                      <div className="offers-min-amount">
                        <FiDollarSign className="offers-min-icon" />
                        <span>Min booking ₹{offer.minAmount}</span>
                      </div>
                    )}

                    {/* Coupon Code */}
                    <div className="offers-coupon">
                      <div className="offers-coupon-label">Coupon Code</div>
                      <div className="offers-coupon-box">
                        <code className="offers-code-text">{offer.couponCode}</code>
                        <button
                          className="offers-copy-btn"
                          onClick={() => copyToClipboard(offer.couponCode)}
                          title="Copy coupon code"
                        >
                          {copiedCode === offer.couponCode ? (
                            <FiCheck className="offers-copy-icon" />
                          ) : (
                            <FiCopy className="offers-copy-icon" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="offers-expiry">
                      <FiCalendar className="offers-expiry-icon" />
                      <span>Valid till {formatDate(offer.expiryDate)}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  {active && (
                    <button className="offers-use-btn">
                      Use This Offer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;