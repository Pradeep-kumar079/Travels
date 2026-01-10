const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  travelname: { type: String, required: true },
  description: { type: String, required: true },
  bus_no: { type: Number, required: true, unique: true },
  bus_type: { type: String, enum: ["AC", "Sleeper", "Seater"], default: "Seater" },
  capacity: { type: Number, required: true },

  from: { type: String, required: true },
  to: { type: String, required: true },
  departure_time: { type: String, required: true },
  arrival_time: { type: String, required: true },
  duration: { type: String, required: true },
  fare: { type: Number, required: true },
  driver_name: { type: String, required: true },

  contact_number: { type: String, required: true },
  alternative_no: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("BusModel", busSchema);
