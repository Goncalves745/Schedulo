const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBusiness,
  getBusinessServices,
  createHorario,
  getHorario,
  getBusiness,
} = require("../controllers/businessController.js");

const router = express.Router();

router.post("/create", authMiddleware, createBusiness);
router.post("/settings/hours", authMiddleware, createHorario);
router.get("/settings/hours", authMiddleware, getHorario);
router.get("/slug", authMiddleware, getBusiness);

module.exports = router;
