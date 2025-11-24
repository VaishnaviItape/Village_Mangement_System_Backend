const express = require("express");
const { getTaxes, getTaxById, createTax, updateTax, deleteTax } = require("../controllers/taxController");

const router = express.Router();

// GET all taxes
router.get("/taxes", getTaxes);

// GET tax by ID
router.get("/taxes/:id", getTaxById);

// CREATE tax
router.post("/taxes", createTax);

// UPDATE tax
router.patch("/taxes/:id", updateTax);

// DELETE tax
router.delete("/taxes/:id", deleteTax);

module.exports = router;
