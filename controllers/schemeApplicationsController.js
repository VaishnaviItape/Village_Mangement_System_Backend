const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all scheme applications
exports.getSchemeApplications = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM scheme_applications");
        if (!data.length) return res.status(404).send({ success: false, message: "No scheme applications found" });

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching scheme applications", error });
    }
};

// Get scheme application by ID
exports.getSchemeApplicationById = async (req, res) => {
    try {
        const schemeApplicationId = req.params.id;
        const [data] = await db.query("SELECT * FROM scheme_applications WHERE scheme_application_id = ?", [schemeApplicationId]);

        if (!data.length) return res.status(404).send({ success: false, message: "Scheme application not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching scheme application", error });
    }
};

// Create a new scheme application
exports.createSchemeApplication = async (req, res) => {
    try {
        const { user_id, scheme_id, eligibility_score } = req.body;

        if (!user_id || !scheme_id) {
            return res.status(400).send({ success: false, message: "user_id and scheme_id are required" });
        }

        const scheme_application_id = uuidv4();

        await db.query(
            "INSERT INTO scheme_applications (scheme_application_id, user_id, scheme_id, eligibility_score) VALUES (?, ?, ?, ?)",
            [scheme_application_id, user_id, scheme_id, eligibility_score || null]
        );

        res.status(201).send({ success: true, message: "Scheme application created successfully", data: { scheme_application_id, user_id, scheme_id, eligibility_score } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create scheme application", error });
    }
};

// Update scheme application (status / score / approved_at)
exports.updateSchemeApplication = async (req, res) => {
    try {
        const schemeApplicationId = req.params.id;
        const [existingData] = await db.query("SELECT * FROM scheme_applications WHERE scheme_application_id = ?", [schemeApplicationId]);

        if (!existingData.length) return res.status(404).send({ success: false, message: "Scheme application not found" });

        const oldData = existingData[0];
        const updatedApplication = {
            status: req.body.status || oldData.status,
            eligibility_score: req.body.eligibility_score ?? oldData.eligibility_score,
            approved_at: req.body.approved_at || oldData.approved_at
        };

        await db.query(
            `UPDATE scheme_applications 
       SET status = ?, eligibility_score = ?, approved_at = ? 
       WHERE scheme_application_id = ?`,
            [updatedApplication.status, updatedApplication.eligibility_score, updatedApplication.approved_at, schemeApplicationId]
        );

        res.status(200).send({ success: true, message: "Scheme application updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating scheme application", error });
    }
};

// Delete scheme application
exports.deleteSchemeApplication = async (req, res) => {
    try {
        const schemeApplicationId = req.params.id;
        const [result] = await db.query("DELETE FROM scheme_applications WHERE scheme_application_id = ?", [schemeApplicationId]);

        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Scheme application not found" });

        res.status(200).send({ success: true, message: "Scheme application deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting scheme application", error });
    }
};
