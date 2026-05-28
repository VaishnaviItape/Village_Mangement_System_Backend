const express = require("express");
const router = express.Router();
const {
    getPanchayatMembers,
    getPanchayatMemberById,
    createPanchayatMember,
    updatePanchayatMember,
    deletePanchayatMember,
} = require("../controllers/panchayatMembersController");

// GET all
router.get("/panchayat-members", getPanchayatMembers);

// GET by ID
router.get("/panchayat-members/:id", getPanchayatMemberById);

// CREATE
router.post("/panchayat-members", createPanchayatMember);

// UPDATE
router.put("/panchayat-members/:id", updatePanchayatMember);
router.patch("/panchayat-members/:id", updatePanchayatMember);

// DELETE
router.delete("/panchayat-members/:id", deletePanchayatMember);

module.exports = router;
