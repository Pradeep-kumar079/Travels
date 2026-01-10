// Routes/SeatRoutes.js
const express = require("express");
const router = express.Router();
const { getBookedSeats } = require("../controllers/SeatController");

router.get("/booked-seats", getBookedSeats);

module.exports = router;
