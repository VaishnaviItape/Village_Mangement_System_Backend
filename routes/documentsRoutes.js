const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // configure as needed

const {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
} = require("../controllers/documentsController");

// GET all documents
router.get("/documents", getDocuments);

// GET document by ID
router.get("/documents/:id", getDocumentById);

// CREATE / UPLOAD document
router.post("/documents", upload.single("file"), createDocument);

// UPDATE document (PATCH)
router.patch("/documents/:id", upload.single("file"), updateDocument);

// DELETE document
router.delete("/documents/:id", deleteDocument);

module.exports = router;
