const express = require("express");
const router = express.Router();
const {
    getCertificates,
    getCertificateById,
    createCertificate,
    updateCertificate,
    deleteCertificate,
} = require("../controllers/certificatesController");

// GET all
router.get("/certificates", getCertificates);

// GET by ID
router.get("/certificates/:id", getCertificateById);

// CREATE
router.post("/certificates", createCertificate);

// UPDATE
router.put("/certificates/:id", updateCertificate);
router.patch("/certificates/:id", updateCertificate);

// DELETE
router.delete("/certificates/:id", deleteCertificate);

module.exports = router;
