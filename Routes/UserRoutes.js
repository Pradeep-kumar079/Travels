const express = require("express");
const router = express.Router();
const {
  registerUser,
  checkUsernameAvailability,
  LoginUser,
  searchBus
} = require("../controllers/UserController");

// Auth
router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/check-username/:username", checkUsernameAvailability);


module.exports = router;
