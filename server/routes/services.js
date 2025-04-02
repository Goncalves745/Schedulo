const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createService,
  deleteService,
} = require("../controllers/servicesController");

const router = express.Router();

router.post("/create", authMiddleware, createService);
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;
