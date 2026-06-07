const express = require("express");
const router = express.Router();
const multer = require("multer");
const civicController = require("../controllers/civicController");
const auth = require("../middlewares/authMiddleware");

// Configure Multer for document uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
router.get("/civic", auth, civicController.getAllRegistrations);
router.get("/civic/my", auth, civicController.getMyRegistrations);
router.post("/civic", auth, upload.single("document"), civicController.createRegistration);
router.put("/civic/:id", auth, civicController.updateRegistrationStatus);

module.exports = router;
