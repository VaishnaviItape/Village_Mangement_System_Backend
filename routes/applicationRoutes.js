const express = require("express");
const {
    getApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
} = require("../controllers/applicationController");

const router = express.Router();

// GET all applications
router.get("/applications", getApplications);

// GET application by ID
router.get("/applications/:id", getApplicationById);

// CREATE application
router.post("/applications", createApplication);

// UPDATE application
router.patch("/applications/:id", updateApplication);

// DELETE application
router.delete("/applications/:id", deleteApplication);

module.exports = router;
