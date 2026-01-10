import { useState } from "react";
import axios from "axios";
import "./AddOffer.css";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://travel-backend-83lh.onrender.com/admin/add-offers", form);

      alert("🎉 Offer Added Successfully");

      // ✅ RESET FORM
      setForm(initialState);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add offer");
    }
  };

  return (
    <div className="offer-page">
      <form className="offer-card" onSubmit={handleSubmit}>
        <h2>Add New Offer</h2>
        <p className="subtitle">Create discount offers for customers</p>

        <div className="form-group">
          <label>Offer Title</label>
          <input
            name="title"
            placeholder="New Year Discount"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Applicable on selected routes"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Coupon Code</label>
            <input
              name="couponCode"
              placeholder="NEWYEAR50"
              value={form.couponCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Discount Type</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
            >
              <option value="FLAT">Flat</option>
              <option value="PERCENT">Percent</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Discount Value</label>
            <input
              name="discountValue"
              type="number"
              placeholder="50"
              value={form.discountValue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Minimum Booking Amount</label>
            <input
              name="minAmount"
              type="number"
              placeholder="500"
              value={form.minAmount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            required
          />
        </div>

        <button className="submit-btn">Add Offer</button>
      </form>
    </div>
  );
};

export default AddOffers;
