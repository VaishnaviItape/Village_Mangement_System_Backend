const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all applications
const getApplications = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM applications");

        if (!data.length) {
            return res.status(404).send({ success: false, message: "No applications found" });
        }

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching applications", error });
    }
};

// Get application by ID
const getApplicationById = async (req, res) => {
    try {
        const applicationId = req.params.id;
        if (!applicationId) return res.status(400).send({ success: false, message: "Application ID is required" });

        const [data] = await db.query("SELECT * FROM applications WHERE application_id = ?", [applicationId]);

        if (data.length === 0) return res.status(404).send({ success: false, message: "Application not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching application", error });
    }
};

// Create a new application
const createApplication = async (req, res) => {
    try {
        const { user_id, certificate_type, application_data } = req.body;

        if (!user_id || !certificate_type || !application_data) {
            return res.status(400).send({ success: false, message: "user_id, certificate_type, and application_data are required" });
        }

        const application_id = uuidv4();

        await db.query(
            `INSERT INTO applications 
        (application_id, user_id, certificate_type, application_data) 
       VALUES (?, ?, ?, ?)`,
            [application_id, user_id, certificate_type, JSON.stringify(application_data)]
        );

        res.status(201).send({ success: true, message: "Application submitted successfully", data: { application_id, user_id, certificate_type, application_data } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create application", error });
    }
};

// Update application (PATCH)
const updateApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        if (!applicationId) return res.status(400).send({ success: false, message: "Application ID is required" });

        const [existingData] = await db.query("SELECT * FROM applications WHERE application_id = ?", [applicationId]);
        if (existingData.length === 0) return res.status(404).send({ success: false, message: "Application not found" });

        const oldData = existingData[0];

        const updatedApplication = {
            user_id: req.body.user_id || oldData.user_id,
            certificate_type: req.body.certificate_type || oldData.certificate_type,
            application_data: req.body.application_data ? JSON.stringify(req.body.application_data) : oldData.application_data,
            status: req.body.status || oldData.status,
            assigned_officer_id: req.body.assigned_officer_id || oldData.assigned_officer_id,
            reason_rejection: req.body.reason_rejection || oldData.reason_rejection,
            certificate_file_url: req.body.certificate_file_url || oldData.certificate_file_url,
            verified_at: req.body.verified_at || oldData.verified_at,
            approved_at: req.body.approved_at || oldData.approved_at,
        };

        await db.query(
            `UPDATE applications 
       SET user_id = ?, certificate_type = ?, application_data = ?, status = ?, assigned_officer_id = ?, reason_rejection = ?, certificate_file_url = ?, verified_at = ?, approved_at = ?
       WHERE application_id = ?`,
            [
                updatedApplication.user_id,
                updatedApplication.certificate_type,
                updatedApplication.application_data,
                updatedApplication.status,
                updatedApplication.assigned_officer_id,
                updatedApplication.reason_rejection,
                updatedApplication.certificate_file_url,
                updatedApplication.verified_at,
                updatedApplication.approved_at,
                applicationId,
            ]
        );

        res.status(200).send({ success: true, message: "Application updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating application", error });
    }
};

// Delete application
const deleteApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        if (!applicationId) return res.status(400).send({ success: false, message: "Application ID is required" });

        const [result] = await db.query("DELETE FROM applications WHERE application_id = ?", [applicationId]);
        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Application not found" });

        res.status(200).send({ success: true, message: "Application deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting application", error });
    }
};

module.exports = { getApplications, getApplicationById, createApplication, updateApplication, deleteApplication };
