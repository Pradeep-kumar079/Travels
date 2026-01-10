const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const userRoutes = require("./Routes/UserRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");
const SeatRoutes = require("./Routes/SeatRoutes");
const bookingRoutes = require("./Routes/BookingRoutes");


dotenv.config();
const app = express();

// DB
connectDB();
require("./utils/SeatLockCleaner");

// Middleware
app.use(cors({
  // origin: process.env.CLIENT_URL || "https://travel-backend-83lh.onrender.com"
  // origin: "https://travel-backend-83lh.onrender.com" || "https://travel-backend-83lh.onrender.com",
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/seats", SeatRoutes);
app.use("/api/bookings", require("./Routes/BookingRoutes"));
app.use("/api/buses", require("./Routes/BusRoutes"));



// Health
app.get("/", (req, res) => {
  res.send("API running ✅");
});

// Production
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
