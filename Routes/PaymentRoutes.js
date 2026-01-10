const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createCashfreeOrder,
  verifyPayment,
} = require("../controllers/PaymentController");

router.post("/create-order", auth, createCashfreeOrder); // 🔐 FIX
router.get("/verify/:orderId", verifyPayment);

module.exports = router;
