const mongoose = require("mongoose");

const dailyRunningBusSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusModel",
    required: true
  },
  runDate: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("DailyRunningBus", dailyRunningBusSchema);
