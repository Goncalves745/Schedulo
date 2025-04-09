const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBusiness,
  getBusinessServices,
} = require("../controllers/businessController.js");
const {
  getAppointmentById,
} = require("../controllers/appointmentsController.js");

const {
  getPublicAvailability,
} = require("../controllers/AvailabilityController.js");

const router = express.Router();

router.get("/:slug/services", getBusinessServices);
router.get("/:slug/availability", getPublicAvailability);
router.get("/appointments/:id", getAppointmentById);

module.exports = router;
