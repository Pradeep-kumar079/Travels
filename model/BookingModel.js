const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usermodel",
      required: true,
    },

    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusModel",
      required: true,
    },
    seats: { type: [String], required: true },
    passenger: { type: Object, required: true },
    travelDate: { type: Date, required: true },
    totalFare: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    seatLockExpiresAt: {
  type: Date,
},

  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
