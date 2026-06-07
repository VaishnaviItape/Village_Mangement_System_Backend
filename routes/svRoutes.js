const express = require("express");
const router = express.Router();
const multer = require("multer");
const svController = require("../controllers/svController");
const auth = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Trade Licenses
router.post("/trade", auth, upload.single("document"), svController.createTradeLicense);
router.get("/trade", auth, svController.getTradeLicenses);
router.get("/trade/my", auth, svController.getMyTradeLicenses);
router.put("/trade/:id", auth, svController.updateTradeLicenseStatus);

// Land Registrations
router.post("/land", auth, upload.single("document"), svController.createLandRegistration);
router.get("/land", auth, svController.getLandRegistrations);
router.get("/land/my", auth, svController.getMyLandRegistrations);
router.put("/land/:id", auth, svController.updateLandStatus);

// Gram Sabha
router.post("/sabha", auth, svController.createMeeting);
router.get("/sabha", auth, svController.getMeetings);
router.put("/sabha/:id", auth, svController.updateMeeting);

// Expenses
router.post("/expenses", auth, svController.createExpense);
router.get("/expenses", auth, svController.getExpenses);

// Vendors
router.post("/vendors", auth, svController.createVendor);
router.get("/vendors", auth, svController.getVendors);

// Asset Maintenance
router.post("/maintenance", auth, svController.createMaintenance);
router.get("/maintenance", auth, svController.getMaintenance);

module.exports = router;
