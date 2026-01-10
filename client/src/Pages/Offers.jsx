import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Offers.css";

const Offers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchOffers();
  }, []);

 const fetchOffers = async () => {
  try {
    const res = await axios.get("https://travel-backend-83lh.onrender.com/admin/offers");
    console.log("Offers API response:", res.data); // DEBUG
    setOffers(res.data);
  } catch (error) {
    console.error("Failed to fetch offers:", error.response?.data || error.message);
  }
};


  return (
    <div className="offers-page">
      <h2>Available Offers</h2>

      <div className="offers-grid">
        {offers.map((offer) => (
          <div className="offer-card" key={offer._id}>
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>

            <div className="offer-code">
              <span>Coupon Code</span>
              <strong>{offer.couponCode}</strong>
            </div>

            <p className="offer-discount">
              {offer.discountType === "FLAT"
                ? `Flat ₹${offer.discountValue} OFF`
                : `${offer.discountValue}% OFF`}
            </p>

            {offer.minAmount && (
              <p className="offer-min">
                Min Booking ₹{offer.minAmount}
              </p>
            )}

            <p className="offer-expiry">
              Valid till {new Date(offer.expiryDate).toDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
