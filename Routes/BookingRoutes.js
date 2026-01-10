const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getMyBookings } = require("../controllers/BookingController");

// GET logged-in user's bookings
router.get("/my-bookings", auth, getMyBookings);

module.exports = router;
