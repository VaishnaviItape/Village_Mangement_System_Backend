const express = require("express");
const router = express.Router();
const {
    getInfrastructure,
    getInfrastructureById,
    createInfrastructure,
    updateInfrastructure,
    deleteInfrastructure,
} = require("../controllers/infrastructureController");

// GET all
router.get("/infrastructure", getInfrastructure);

// GET by ID
router.get("/infrastructure/:id", getInfrastructureById);

// CREATE
router.post("/infrastructure", createInfrastructure);

// UPDATE
router.put("/infrastructure/:id", updateInfrastructure);
router.patch("/infrastructure/:id", updateInfrastructure);

// DELETE
router.delete("/infrastructure/:id", deleteInfrastructure);

module.exports = router;
