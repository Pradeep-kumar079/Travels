const express = require("express");
const router = express.Router();
const { getBusesWithAvailability } = require("../controllers/BusController");

router.get("/search", getBusesWithAvailability);

module.exports = router;
