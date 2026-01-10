// controllers/SeatController.js
const Booking = require("../model/BookingModel");

exports.getBookedSeats = async (req, res) => {
  const { busId, travelDate } = req.query;

  const bookings = await Booking.find({
    busId,
    travelDate: new Date(travelDate),
    paymentStatus: "PAID", // 🔒 ONLY PAID SEATS
  });

  const bookedSeats = bookings.flatMap(b => b.seats);

  res.json({ bookedSeats });
};
