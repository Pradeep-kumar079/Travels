 
// const DailyRunningBus = require("../model/DailyRunningBus");
// const Booking = require("../model/BookingModel");
// const BusModel = require("../model/Busmodel");

// // exports.getBusesWithAvailability = async (req, res) => {
// //   try {
// //     const { from, to, travelDate } = req.query;

// //     if (!from || !to || !travelDate) {
// //       return res.json({ buses: [] });
// //     }
// //     console.log("Search Params:", { from, to, travelDate });

// //     // ✅ SAME NORMALIZATION AS ADMIN
// //     const date = new Date(travelDate);
// //     date.setHours(0, 0, 0, 0);

// //     // 1️⃣ Buses allowed on that date
// //     const running = await DailyRunningBus.find({ runDate: date });
// //     if (!running.length) return res.json({ buses: [] });

// //     const busIds = running.map(r => r.busId);

// //     // 2️⃣ Route match
// //     const buses = await BusModel.find({
// //       _id: { $in: busIds },
// //       from: new RegExp(`^${from}$`, "i"),
// //       to: new RegExp(`^${to}$`, "i")
// //     });

// //     const results = [];

// //     // 3️⃣ Available seats calculation
// //     for (const bus of buses) {
// //       const bookings = await Booking.find({
// //         busId: bus._id,
// //         travelDate: date,
// //         paymentStatus: "PAID"
// //       });

// //       const bookedSeats = bookings.reduce(
// //         (sum, b) => sum + b.seats.length,
// //         0
// //       );

// //       results.push({
// //         ...bus.toObject(),
// //         available_seats: bus.capacity - bookedSeats
// //       });
// //     }

// //     res.json({ buses: results });
// //   } catch (err) {
// //     res.status(500).json({ buses: [] });
// //   }
// // };

// exports.getBusesWithAvailability = async (req, res) => {
//   try {
//     let { from, to, travelDate } = req.query;

//     if (!from || !to || !travelDate) {
//       return res.json({ buses: [] });
//     }

//     // ✅ Normalize inputs
//     from = from.trim().toLowerCase();
//     to = to.trim().toLowerCase();

//     // ✅ Date normalization
//     const date = new Date(travelDate);
//     date.setHours(0, 0, 0, 0);

//     // 1️⃣ Find allowed buses
//     const running = await DailyRunningBus.find({ runDate: travelDate });
//     if (!running.length) return res.json({ buses: [] });

//     const busIds = running.map(r => r.busId);

//     // 2️⃣ ROUTE MATCH (TRIM SAFE)
//     const buses = await BusModel.find({
//       _id: { $in: busIds },
//       from: new RegExp(`^${from}$`, "i"),
//       to: new RegExp(`^${to}$`, "i")
//     });

//     const results = [];

//     // 3️⃣ Seat availability
//     for (const bus of buses) {
//       const bookings = await Booking.find({
//         busId: bus._id,
//         travelDate: date,
//         paymentStatus: "PAID"
//       });

//       const bookedSeats = bookings.reduce(
//         (sum, b) => sum + b.seats.length,
//         0
//       );

//       results.push({
//         ...bus.toObject(),
//         available_seats: bus.capacity - bookedSeats
//       });
//     }

//     res.json({ buses: results });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ buses: [] });
//   }
// };
const DailyRunningBus = require("../model/DailyRunningBus");
const Booking = require("../model/BookingModel");
const BusModel = require("../model/Busmodel");

exports.getBusesWithAvailability = async (req, res) => {
  try {
    let { from, to, travelDate } = req.query;

    if (!from || !to || !travelDate) {
      return res.json({ buses: [] });
    }

    // ✅ normalize route
    from = from.trim().toLowerCase();
    to = to.trim().toLowerCase();

    // ✅ DATE RANGE (CRITICAL FIX)
    const start = new Date(travelDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(travelDate);
    end.setHours(23, 59, 59, 999);

    // 1️⃣ find allowed buses for that day
    const running = await DailyRunningBus.find({
      runDate: { $gte: start, $lte: end }
    });

    if (!running.length) {
      return res.json({ buses: [] });
    }

    const busIds = running.map(r => r.busId);

    // 2️⃣ match route
    const buses = await BusModel.find({
      _id: { $in: busIds },
      from,
      to
    });

    const results = [];

    // 3️⃣ seat availability
    for (const bus of buses) {
      const bookings = await Booking.find({
        busId: bus._id,
        travelDate: { $gte: start, $lte: end },
        paymentStatus: "PAID"
      });

      const bookedCount = bookings.reduce(
        (sum, b) => sum + b.seats.length,
        0
      );

      results.push({
        ...bus.toObject(),
        available_seats: bus.capacity - bookedCount
      });
    }

    res.json({ buses: results });
  } catch (err) {
    console.error("Bus search error:", err);
    res.status(500).json({ buses: [] });
  }
};
