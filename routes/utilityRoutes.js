const express = require("express");
const router = express.Router();
const multer = require("multer");
const utilityController = require("../controllers/utilityController");
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
router.get("/utility", auth, utilityController.getAllRequests);
router.get("/utility/my", auth, utilityController.getMyRequests);
router.post("/utility", auth, upload.single("document"), utilityController.createRequest);
router.put("/utility/:id", auth, utilityController.updateStatus);

module.exports = router;
