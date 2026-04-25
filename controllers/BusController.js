const DailyRunningBus = require("../model/DailyRunningBus");
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
      STEP 3 — Since runDate is now STRING
      example:
      "2026-04-25"

      We should NOT use Date range query
    */

    console.log("📅 Searching for exact date:", travelDate);

    /*
      STEP 4 — Find buses allowed by admin
      EXACT MATCH on string date
    */

    const runningBuses = await DailyRunningBus.find({
      runDate: travelDate,
    });

    console.log("🟢 Running Buses:", runningBuses);

    if (!runningBuses.length) {
      return res.json({
        buses: [],
      });
    }

    /*
      STEP 5 — Get bus IDs
    */

    const busIds = runningBuses.map(
      (item) => item.busId
    );

    /*
      STEP 6 — Match route
    */

    const matchedBuses = await BusModel.find({
      _id: {
        $in: busIds,
      },
      from,
      to,
    });

    console.log("🚌 Matched Buses:", matchedBuses);

    if (!matchedBuses.length) {
      return res.json({
        buses: [],
      });
    }

    /*
      STEP 7 — Seat availability
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
      STEP 8 — Final Response
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