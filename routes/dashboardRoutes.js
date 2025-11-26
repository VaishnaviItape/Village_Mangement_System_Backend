const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");

const router = express.Router();

// Dashboard Main API
router.get("/dashboard", getDashboardStats);

module.exports = router;
