const BusModel = require("../model/Busmodel");
const DailyRunningBus = require("../model/DailyRunningBus");
const Offer = require("../model/Offers");

exports.GetAllBuseController = async (req, res) => {
  const buses = await BusModel.find();
  res.json({ buses });
};

// exports.AddBusController = async (req, res) => {
//   const { bus_no } = req.body;
//   const exists = await BusModel.findOne({ bus_no });
//   if (exists) return res.status(400).json({ message: "Bus already exists" });

//   const bus = await BusModel.create(req.body);
//   res.status(201).json({ bus });
// };
exports.AddBusController = async (req, res) => {
  const data = {
    ...req.body,
    from: req.body.from.trim().toLowerCase(),
    to: req.body.to.trim().toLowerCase()
  };

  const exists = await BusModel.findOne({ bus_no: data.bus_no });
  if (exists) {
    return res.status(400).json({ message: "Bus already exists" });
  }

  const bus = await BusModel.create(data);
  res.status(201).json({ bus });
};

exports.EditBusController = async (req, res) => {
  const bus = await BusModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ bus });
};

exports.DeleteBusController = async (req, res) => {
  await BusModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Bus deleted" });
};

 
exports.AllowDailyRunController = async (req, res) => {
  try {
    const { busId, runDate } = req.body;

    const date = new Date(runDate);
    date.setHours(0, 0, 0, 0);

    const exists = await DailyRunningBus.findOne({
      busId,
      runDate: { $gte: date, $lte: new Date(date.getTime() + 86400000) }
    });

    if (exists) {
      return res.status(400).json({ message: "Already scheduled" });
    }

    const entry = await DailyRunningBus.create({
      busId,
      runDate: date
    });

    res.json({ entry });
  } catch (err) {
    res.status(500).json({ message: "Failed to schedule bus" });
  }
};


exports.GetDailyRunningBuses = async (req, res) => {
  const buses = await DailyRunningBus.find().populate("busId");
  res.json({ buses });
};

exports.AddingOffersController = async (req, res) => {
  try {
    const {
      title,
      couponCode,
      discountType,
      discountValue,
      expiryDate
    } = req.body;

    if (!title || !couponCode || !discountType || !discountValue || !expiryDate) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const exists = await Offer.findOne({ couponCode });
    if (exists) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const offer = await Offer.create(req.body);
    res.status(201).json({ message: "Offer added", offer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all active offers (for users)
exports.GetActiveOffersController = async (req, res) => {
  try {
    // Get today's date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const offers = await Offer.find({
      status: true,
      expiryDate: { $gte: today },
    }).sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    console.error("Offer fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};
