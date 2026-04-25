const mongoose = require("mongoose");

const stoppedBusSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusModel",
      required: true,
    },

    stopDate: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StoppedBus",
  stoppedBusSchema
);