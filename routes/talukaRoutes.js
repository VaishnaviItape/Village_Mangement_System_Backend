const express = require("express");
const router = express.Router();
const {
    getTalukas,
    createTaluka,
    updateTaluka,
    deleteTaluka
} = require("../controllers/talukaController");

// GET all
router.get("/taluka", getTalukas);

// CREATE
router.post("/taluka", createTaluka);

// UPDATE
router.put("/taluka/:id", updateTaluka);

// DELETE
router.delete("/taluka/:id", deleteTaluka);

module.exports = router;
