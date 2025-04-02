const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBusiness,
  getBusinessServices,
} = require("../controllers/businessController.js");

const router = express.Router();

router.post("/create", authMiddleware, createBusiness);
router.get("/services", authMiddleware, getBusinessServices);

module.exports = router;
