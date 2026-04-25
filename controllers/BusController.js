// controllers/BusController.js
// FINAL FIXED VERSION
// Logic:
// Every bus runs daily by default
// Admin can STOP a bus for selected date

// const StoppedBus = require("../model/StoppedBus");
// const Booking = require("../model/BookingModel");
// const BusModel = require("../model/Busmodel");

// FINAL PROFESSIONAL VERSION
// Every bus runs daily by default
// Admin only stops buses for selected dates

const StoppedBus = require("../model/StoppedBus");
const Booking = require("../model/BookingModel");
const BusModel = require("../model/Busmodel");

exports.getBusesWithAvailability = async (req, res) => {
  try {
    let { from, to, travelDate } = req.query;

    console.log("🔍 Search Params:", {
      from,
      to,
      travelDate,
    });

    /*
      STEP 1 — Validation
    */

    if (!from || !to || !travelDate) {
      return res.json({
        buses: [],
      });
    }

    /*
      STEP 2 — Normalize route values
    */

    from = from.trim().toLowerCase();
    to = to.trim().toLowerCase();

    /*
      STEP 3 — Find stopped buses
      for selected date

      Logic:
      All buses run by default
      except stopped buses
    */

    const stoppedBuses = await StoppedBus.find({
      stopDate: travelDate,
    });

    console.log("🛑 Stopped Buses:", stoppedBuses);

    /*
      STEP 4 — Get stopped bus IDs
    */

    const stoppedIds = stoppedBuses.map(
      (item) => item.busId.toString()
    );

    /*
      STEP 5 — Find route buses
      excluding stopped buses
    */

    const matchedBuses = await BusModel.find({
      from,
      to,
      _id: {
        $nin: stoppedIds,
      },
    });

    console.log("🚌 Available Buses:", matchedBuses);

    if (!matchedBuses.length) {
      return res.json({
        buses: [],
      });
    }

    /*
      STEP 6 — Calculate seat availability
    */

    const finalBuses = [];

    for (const bus of matchedBuses) {
      const bookings = await Booking.find({
        busId: bus._id,
        travelDate,
        paymentStatus: "PAID",
      });

      const bookedSeats = bookings.reduce(
        (total, booking) =>
          total + booking.seats.length,
        0
      );

      finalBuses.push({
        ...bus.toObject(),
        available_seats:
          bus.capacity - bookedSeats,
      });
    }

    /*
      STEP 7 — Final response
    */

    console.log("✅ Final Buses:", finalBuses);

    return res.json({
      buses: finalBuses,
    });
  } catch (error) {
    console.error(
      "❌ Bus Search Error:",
      error
    );

    return res.status(500).json({
      buses: [],
      message: "Server Error",
    });
  }
};