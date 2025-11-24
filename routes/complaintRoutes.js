const express = require("express");
const {
    getComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint,
} = require("../controllers/complaintController");

const router = express.Router();

// GET all complaints
router.get("/complaints", getComplaints);

// GET complaint by ID
router.get("/complaints/:id", getComplaintById);

// CREATE complaint
router.post("/complaints", createComplaint);

// UPDATE complaint
router.patch("/complaints/:id", updateComplaint);

// DELETE complaint
router.delete("/complaints/:id", deleteComplaint);

module.exports = router;
