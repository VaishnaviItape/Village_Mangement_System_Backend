const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const auth = require("../middlewares/authMiddleware");

router.get("/reports/taxes", auth, reportsController.getTaxReport);
router.get("/reports/complaints", auth, reportsController.getComplaintReport);
router.get("/reports/users", auth, reportsController.getUserReport);

module.exports = router;
