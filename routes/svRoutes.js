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
router.delete("/trade/:id", auth, svController.deleteTradeLicense);

// Land Registrations
router.post("/land", auth, upload.single("document"), svController.createLandRegistration);
router.get("/land", auth, svController.getLandRegistrations);
router.get("/land/my", auth, svController.getMyLandRegistrations);
router.put("/land/:id", auth, svController.updateLandStatus);
router.delete("/land/:id", auth, svController.deleteLandRegistration);

// Gram Sabha
router.post("/sabha", auth, svController.createMeeting);
router.get("/sabha", auth, svController.getMeetings);
router.put("/sabha/:id", auth, svController.updateMeeting);
router.delete("/sabha/:id", auth, svController.deleteMeeting);

// Expenses
router.post("/expenses", auth, svController.createExpense);
router.get("/expenses", auth, svController.getExpenses);
router.put("/expenses/:id", auth, svController.updateExpense);
router.delete("/expenses/:id", auth, svController.deleteExpense);

// Vendors
router.post("/vendors", auth, svController.createVendor);
router.get("/vendors", auth, svController.getVendors);
router.put("/vendors/:id", auth, svController.updateVendor);
router.delete("/vendors/:id", auth, svController.deleteVendor);

// Asset Maintenance
router.post("/maintenance", auth, svController.createMaintenance);
router.get("/maintenance", auth, svController.getMaintenance);
router.put("/maintenance/:id", auth, svController.updateMaintenance);
router.delete("/maintenance/:id", auth, svController.deleteMaintenance);

module.exports = router;
