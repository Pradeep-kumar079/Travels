const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ["FLAT", "PERCENT"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minAmount: Number,
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
