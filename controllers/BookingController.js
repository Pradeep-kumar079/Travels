const Booking = require("../model/BookingModel");

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({
      userId,
      paymentStatus: "PAID",
    }).populate("busId");

    res.json({ bookings });
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};



// const Bus = require("../models/Bus");
// const Booking = require("../models/Booking");

exports.bookSeat = async (req, res) => {
  const { busId, seats } = req.body; // seats = selected seats array

  const bus = await Bus.findById(busId);

  if (!bus) {
    return res.status(404).json({ message: "Bus not found" });
  }

  if (bus.available_seats < seats.length) {
    return res.status(400).json({ message: "Not enough seats available" });
  }

  // ✅ reduce seats
  bus.available_seats -= seats.length;
  await bus.save();

  // save booking
  const booking = new Booking({
    bus: busId,
    seats
  });

  await booking.save();

  res.json({
    message: "Booking successful",
    updatedSeats: bus.available_seats
  });
};
