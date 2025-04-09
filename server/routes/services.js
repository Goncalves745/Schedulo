const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createService,
  deleteService,
  getServices,
} = require("../controllers/servicesController");

const router = express.Router();

router.post("/create", authMiddleware, createService);
router.delete("/:id", authMiddleware, deleteService);
router.get("/", authMiddleware, getServices);
module.exports = router;
