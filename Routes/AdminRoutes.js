const express = require("express");
const router = express.Router();

const {
  GetAllBuseController,
  AddBusController,
  EditBusController,
  DeleteBusController,
  AllowDailyRunController,
  GetDailyRunningBuses,
  AddingOffersController,
  GetActiveOffersController
} = require("../controllers/AdminController");

router.get("/all-buses", GetAllBuseController);
router.post("/add-newbus", AddBusController);
router.put("/edit-bus/:id", EditBusController);
router.delete("/delete-bus/:id", DeleteBusController);

router.post("/allowrun", AllowDailyRunController);
router.get("/daily-running", GetDailyRunningBuses);

router.post("/add-offers", AddingOffersController);
router.get("/offers", GetActiveOffersController);
module.exports = router;
