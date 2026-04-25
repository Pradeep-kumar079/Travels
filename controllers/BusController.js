 
const DailyRunningBus = require("../model/DailyRunningBus");
const Booking = require("../model/BookingModel");
const BusModel = require("../model/Busmodel");

// exports.getBusesWithAvailability = async (req, res) => {
//   try {
//     let { from, to, travelDate } = req.query;

//     if (!from || !to || !travelDate) {
//       return res.json({ buses: [] });
//     }

//     // ✅ normalize route
//     from = from.trim().toLowerCase();
//     to = to.trim().toLowerCase();

//     // ✅ DATE RANGE (CRITICAL FIX)
//     const start = new Date(travelDate);
//     start.setHours(0, 0, 0, 0);

//     const end = new Date(travelDate);
//     end.setHours(23, 59, 59, 999);

//     // 1️⃣ find allowed buses for that day
//     const running = await DailyRunningBus.find({
//       runDate: { $gte: start, $lte: end }
//     });

//     if (!running.length) {
//       return res.json({ buses: [] });
//     }

//     const busIds = running.map(r => r.busId);

//     // 2️⃣ match route
//     const buses = await BusModel.find({
//       _id: { $in: busIds },
//       from,
//       to
//     });

//     const results = [];

//     // 3️⃣ seat availability
//     for (const bus of buses) {
//       const bookings = await Booking.find({
//         busId: bus._id,
//         travelDate: { $gte: start, $lte: end },
//         paymentStatus: "PAID"
//       });

//       const bookedCount = bookings.reduce(
//         (sum, b) => sum + b.seats.length,
//         0
//       );

//       results.push({
//         ...bus.toObject(),
//         available_seats: bus.capacity - bookedCount
//       });
//     }

//     res.json({ buses: results });
//   } catch (err) {
//     console.error("Bus search error:", err);
//     res.status(500).json({ buses: [] });
//   }
// };


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
      (same as admin add bus)
    */

    from = from.trim().toLowerCase();
    to = to.trim().toLowerCase();

    /*
      STEP 3 — Proper date range for whole day
    */

    const start = new Date(travelDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(travelDate);
    end.setHours(23, 59, 59, 999);

    console.log("📅 Date Range:", {
      start,
      end,
    });

    /*
      STEP 4 — Find buses allowed to run
      by admin for that date
    */

    const runningBuses = await DailyRunningBus.find({
      runDate: {
        $gte: start,
        $lte: end,
      },
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
      STEP 6 — Match route buses
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
      STEP 7 — Calculate available seats
    */

    const finalBuses = [];

    for (const bus of matchedBuses) {
      const bookings = await Booking.find({
        busId: bus._id,
        travelDate: {
          $gte: start,
          $lte: end,
        },
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
      STEP 8 — Final response
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