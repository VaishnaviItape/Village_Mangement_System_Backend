const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all certificates
exports.getCertificates = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM certificates");
        if (!data.length) return res.status(404).send({ success: false, message: "No certificates found" });

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching certificates", error });
    }
};

// Get certificate by ID
exports.getCertificateById = async (req, res) => {
    try {
        const certificateId = req.params.id;
        const [data] = await db.query("SELECT * FROM certificates WHERE certificate_id = ?", [certificateId]);

        if (!data.length) return res.status(404).send({ success: false, message: "Certificate not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching certificate", error });
    }
};

// Create a new certificate
exports.createCertificate = async (req, res) => {
    try {
        const { user_id, certificate_type, status, issue_date } = req.body;

        if (!user_id || !certificate_type) {
            return res.status(400).send({ success: false, message: "user_id and certificate_type are required" });
        }

        const certificate_id = uuidv4();

        await db.query(
            "INSERT INTO certificates (certificate_id, user_id, certificate_type, status, issue_date) VALUES (?, ?, ?, ?, ?)",
            [certificate_id, user_id, certificate_type, status || 'Pending', issue_date || null]
        );

        res.status(201).send({ success: true, message: "Certificate created successfully", data: { certificate_id, user_id, certificate_type, status, issue_date } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create certificate", error });
    }
};

// Update certificate
exports.updateCertificate = async (req, res) => {
    try {
        const certificateId = req.params.id;
        const [existingData] = await db.query("SELECT * FROM certificates WHERE certificate_id = ?", [certificateId]);

        if (!existingData.length) return res.status(404).send({ success: false, message: "Certificate not found" });

        const oldData = existingData[0];
        const updatedCert = {
            certificate_type: req.body.certificate_type || oldData.certificate_type,
            status: req.body.status || oldData.status,
            issue_date: req.body.issue_date ?? oldData.issue_date
        };

        await db.query(
            `UPDATE certificates 
             SET certificate_type = ?, status = ?, issue_date = ? 
             WHERE certificate_id = ?`,
            [updatedCert.certificate_type, updatedCert.status, updatedCert.issue_date, certificateId]
        );

        res.status(200).send({ success: true, message: "Certificate updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating certificate", error });
    }
};

// Delete certificate
exports.deleteCertificate = async (req, res) => {
    try {
        const certificateId = req.params.id;
        const [result] = await db.query("DELETE FROM certificates WHERE certificate_id = ?", [certificateId]);

        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Certificate not found" });

        res.status(200).send({ success: true, message: "Certificate deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting certificate", error });
    }
};
