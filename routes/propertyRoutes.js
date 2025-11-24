const express = require("express");
const router = express.Router();

const {
    getProperty,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    propertyController,
    bulkUploadProperty
} = require("../controllers/propertyController");
const upload = require("../middlewares/fileUpload");
// Routes
router.get("/properties", getProperty);
router.get("/properties/:id", getPropertyById);
router.post("/properties", createProperty);
router.put("/properties/:id", updateProperty);
router.delete("/properties/:id", deleteProperty);
router.post("/property/upload", upload.single("file"), bulkUploadProperty);

module.exports = router;
