const axios = require("axios");
const Booking = require("../model/BookingModel");
const Bus = require("../model/Busmodel");
const { sendWhatsApp } = require("../utils/notify");
const { sendTicketEmail } = require("../utils/emailService");
const { generateTicketMessage } = require("../utils/ticketTemplate");

const CASHFREE_BASE =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com"
    : "https://sandbox.cashfree.com";

/* ======================================================
   CREATE ORDER + SAVE PENDING BOOKING
====================================================== */
exports.createCashfreeOrder = async (req, res) => {
  try {
    // 🔐 AUTH CHECK (VERY IMPORTANT)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { amount, customer, busId, seats, travelDate } = req.body;

    if (!amount || !busId || !seats?.length || !travelDate) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const orderId = "ORDER_" + Date.now();

    // ❌ Seat already booked check
    const alreadyBooked = await Booking.findOne({
      busId,
      travelDate,
      seats: { $in: seats },
      paymentStatus: "PAID",
    });

    if (alreadyBooked) {
      return res
        .status(400)
        .json({ message: "Some seats are already booked" });
    }

    // 🔒 Save PENDING booking
    await Booking.create({
      orderId,
      userId: req.user.id,
      busId,
      seats,
      passenger: customer,
      travelDate,
      totalFare: amount,
      paymentStatus: "PENDING",
      seatLockExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // 💳 Create Cashfree Order
    const response = await axios.post(
      `${CASHFREE_BASE}/pg/orders`,
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: "CUST_" + Date.now(),
          customer_name: customer.name,
          customer_phone: customer.contact,
          customer_email: customer.email || "test@gmail.com",
        },
        order_meta: {
          return_url: `${process.env.CLIENT_URL}/payment-success?order_id=${orderId}`,
        },
      },
      {
        headers: {
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      paymentSessionId: response.data.payment_session_id,
      orderId,
    });
  } catch (error) {
    console.error("❌ Create order error:", error.message);
    res.status(500).json({ message: "Payment order creation failed" });
  }
};

/* ======================================================
   VERIFY PAYMENT + CONFIRM BOOKING + SEND TICKET
====================================================== */
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    // 🔍 Check Cashfree payment status
    const response = await axios.get(
      `${CASHFREE_BASE}/pg/orders/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "x-api-version": "2023-08-01",
        },
      }
    );

    if (!response.data || response.data.order_status !== "PAID") {
      await Booking.findOneAndUpdate(
        { orderId },
        { paymentStatus: "FAILED" }
      );
      return res.json({ success: false });
    }

    // 🔒 Fetch booking
    const booking = await Booking.findOne({ orderId });
    if (!booking) return res.json({ success: false });

    // Already confirmed
    if (booking.paymentStatus === "PAID") {
      return res.json({ success: true });
    }

    booking.paymentStatus = "PAID";
    await booking.save();

    // 🔥 Fetch bus
    const bus = await Bus.findById(booking.busId);

    // 🎟️ Ticket message
    const ticketMessage = generateTicketMessage(booking, bus);

    // 📩 WhatsApp (SAFE – won't crash)
    try {
      await sendWhatsApp(booking.passenger.contact, ticketMessage);
    } catch (err) {
      console.warn("⚠️ WhatsApp failed:", err.message);
    }

    // 📧 Email (optional)
    if (booking.passenger.email) {
      try {
        await sendTicketEmail(
          booking.passenger.email,
          "🎟️ Bus Ticket Confirmation",
          ticketMessage
        );
      } catch (err) {
        console.warn("⚠️ Email failed:", err.message);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Verify error:", error.message);
    res.status(500).json({ success: false });
  }
};
