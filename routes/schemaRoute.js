const express = require("express");
const router = express.Router();

const {
    getSchemes,
    getSchemeById,
    createScheme,
    updateScheme,
    deleteScheme
} = require("../controllers/schemaController");
const upload = require("../middlewares/fileUpload");
// Routes
router.get("/schemes", getSchemes);
router.get("/schemes/:id", getSchemeById);
router.post("/schemes", createScheme);
router.put("/schemes/:id", updateScheme);
router.delete("/schemes/:id", deleteScheme);


module.exports = router;
