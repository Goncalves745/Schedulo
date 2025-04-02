const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createPublicAppointment,
  getAppointments,
  deleteAppointment,
} = require("../controllers/appointmentsController");

const router = express.Router();

router.post("/create", createPublicAppointment);
router.get("/", authMiddleware, getAppointments);
router.delete("/:id", authMiddleware, deleteAppointment);

module.exports = router;
