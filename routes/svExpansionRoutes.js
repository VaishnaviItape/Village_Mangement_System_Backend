const express = require("express");
const router = express.Router();
const svExpansionController = require("../controllers/svExpansionController");

// Marketplace
router.get("/marketplace", svExpansionController.getMarketplaceItems);
router.post("/marketplace", svExpansionController.addMarketplaceItem);

// Health & Sanitation
router.get("/health", svExpansionController.getHealthRecords);
router.post("/health", svExpansionController.addHealthRecord);

// Payments
router.get("/payments", svExpansionController.getPayments);
router.post("/payments", svExpansionController.processPayment);

// Audit Report
router.get("/audit", svExpansionController.getAuditReport);

module.exports = router;
