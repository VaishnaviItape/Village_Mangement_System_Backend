const express = require("express");
const router = express.Router();
const {
    getCitizens,
    getCitizenById,
    createCitizen,
    updateCitizen,
    deleteCitizen
} = require("../controllers/citizenController");

// GET all citizens
router.get("/citizens", getCitizens);

// GET citizen by ID
router.get("/citizens/:id", getCitizenById);

// CREATE citizen
router.post("/citizens", createCitizen);

// UPDATE citizen
router.put("/citizens/:id", updateCitizen);

// DELETE citizen
router.delete("/citizens/:id", deleteCitizen);

module.exports = router;
