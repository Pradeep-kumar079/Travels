const cron = require("node-cron");
const Booking = require("../model/BookingModel");

cron.schedule("*/2 * * * *", async () => {
  try {
    const result = await Booking.deleteMany({
      paymentStatus: "PENDING",
      seatLockExpiresAt: { $lt: new Date() },
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 Cleared ${result.deletedCount} expired seat locks`);
    }
  } catch (err) {
    console.error("Seat lock cleanup error:", err);
  }
});
