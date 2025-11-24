const express = require("express");
const router = express.Router();
const {
    getSchemeApplications,
    getSchemeApplicationById,
    createSchemeApplication,
    updateSchemeApplication,
    deleteSchemeApplication,
} = require("../controllers/schemeApplicationsController");

// GET all
router.get("/scheme-applications", getSchemeApplications);

// GET by ID
router.get("/scheme-applications/:id", getSchemeApplicationById);

// CREATE
router.post("/scheme-applications", createSchemeApplication);

// UPDATE
router.patch("/scheme-applications/:id", updateSchemeApplication);

// DELETE
router.delete("/scheme-applications/:id", deleteSchemeApplication);

module.exports = router;
