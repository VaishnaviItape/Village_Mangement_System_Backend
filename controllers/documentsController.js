const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all documents
exports.getDocuments = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM documents");
        if (!data.length) return res.status(404).send({ success: false, message: "No documents found" });

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching documents", error });
    }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
    try {
        const documentId = req.params.id;
        const [data] = await db.query("SELECT * FROM documents WHERE document_id = ?", [documentId]);

        if (!data.length) return res.status(404).send({ success: false, message: "Document not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching document", error });
    }
};

// Create / Upload a new document
exports.createDocument = async (req, res) => {
    try {
        const { application_id, user_id, document_type } = req.body;

        if (!application_id || !user_id || !document_type || !req.file) {
            return res.status(400).send({ success: false, message: "application_id, user_id, document_type, and file are required" });
        }

        const document_id = uuidv4();
        const file_url = `/uploads/${req.file.filename}`;

        await db.query(
            "INSERT INTO documents (document_id, application_id, user_id, document_type, file_url) VALUES (?, ?, ?, ?, ?)",
            [document_id, application_id, user_id, document_type, file_url]
        );

        res.status(201).send({ success: true, message: "Document uploaded successfully", data: { document_id, application_id, user_id, document_type, file_url } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to upload document", error });
    }
};

// Update document info (PATCH)
exports.updateDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const [existingData] = await db.query("SELECT * FROM documents WHERE document_id = ?", [documentId]);

        if (!existingData.length) return res.status(404).send({ success: false, message: "Document not found" });

        const oldData = existingData[0];

        const updatedDocument = {
            application_id: req.body.application_id || oldData.application_id,
            user_id: req.body.user_id || oldData.user_id,
            document_type: req.body.document_type || oldData.document_type,
            verified_status: req.body.verified_status || oldData.verified_status,
            file_url: req.file ? `/uploads/${req.file.filename}` : oldData.file_url,
        };

        await db.query(
            `UPDATE documents 
       SET application_id = ?, user_id = ?, document_type = ?, verified_status = ?, file_url = ? 
       WHERE document_id = ?`,
            [updatedDocument.application_id, updatedDocument.user_id, updatedDocument.document_type, updatedDocument.verified_status, updatedDocument.file_url, documentId]
        );

        res.status(200).send({ success: true, message: "Document updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating document", error });
    }
};

// Delete document
exports.deleteDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const [result] = await db.query("DELETE FROM documents WHERE document_id = ?", [documentId]);

        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Document not found" });

        res.status(200).send({ success: true, message: "Document deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting document", error });
    }
};
