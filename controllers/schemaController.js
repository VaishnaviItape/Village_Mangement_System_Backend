const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all schemes
const getSchemes = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM scheme");

        if (!data.length) {
            return res.status(404).send({
                success: false,
                message: "No schemes found",
            });
        }

        res.status(200).send({
            success: true,
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching schemes",
            error,
        });
    }
};

// Get scheme by ID
const getSchemeById = async (req, res) => {
    try {
        const schemeId = req.params.id;

        if (!schemeId) {
            return res.status(400).send({
                success: false,
                message: "Scheme ID is required",
            });
        }

        const [data] = await db.query(
            "SELECT * FROM scheme WHERE scheme_id = ?",
            [schemeId]
        );

        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Scheme not found",
            });
        }

        res.status(200).send({
            success: true,
            data: data[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching scheme by ID",
            error,
        });
    }
};

// Create a new scheme
const createScheme = async (req, res) => {
    try {
        const { scheme_name, eligibility_criteria, description, start_date, end_date, status } = req.body;

        if (!scheme_name) {
            return res.status(400).send({
                success: false,
                message: "Scheme name is required",
            });
        }

        const schemeId = uuidv4();

        const [data] = await db.query(
            `INSERT INTO scheme 
            (scheme_id, scheme_name, eligibility_criteria, description, start_date, end_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                schemeId,
                scheme_name,
                JSON.stringify(eligibility_criteria || {}),
                description || null,
                start_date || null,
                end_date || null,
                status || 'Active'
            ]
        );

        res.status(200).send({
            success: true,
            message: "Scheme created successfully",
            data: { scheme_id: schemeId, scheme_name, eligibility_criteria, description, start_date, end_date, status },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to create scheme",
            error,
        });
    }
};

// Update a scheme (PATCH)
const updateScheme = async (req, res) => {
    try {
        const schemeId = req.params.id;

        if (!schemeId) {
            return res.status(400).send({
                success: false,
                message: "Scheme ID is required",
            });
        }

        const [existingData] = await db.query(
            "SELECT * FROM scheme WHERE scheme_id = ?",
            [schemeId]
        );

        if (existingData.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Scheme not found",
            });
        }

        const oldData = existingData[0];

        const updatedScheme = {
            scheme_name: req.body.scheme_name || oldData.scheme_name,
            eligibility_criteria: req.body.eligibility_criteria ? JSON.stringify(req.body.eligibility_criteria) : oldData.eligibility_criteria,
            description: req.body.description ?? oldData.description,
            start_date: req.body.start_date ?? oldData.start_date,
            end_date: req.body.end_date ?? oldData.end_date,
            status: req.body.status || oldData.status,
        };

        await db.query(
            `UPDATE scheme SET 
                scheme_name = ?, 
                eligibility_criteria = ?, 
                description = ?, 
                start_date = ?, 
                end_date = ?, 
                status = ? 
             WHERE scheme_id = ?`,
            [
                updatedScheme.scheme_name,
                updatedScheme.eligibility_criteria,
                updatedScheme.description,
                updatedScheme.start_date,
                updatedScheme.end_date,
                updatedScheme.status,
                schemeId
            ]
        );

        res.status(200).send({
            success: true,
            message: "Scheme updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating scheme",
            error,
        });
    }
};

// Delete a scheme
const deleteScheme = async (req, res) => {
    try {
        const schemeId = req.params.id;

        if (!schemeId) {
            return res.status(400).send({
                success: false,
                message: "Scheme ID is required",
            });
        }

        const [data] = await db.query(
            "DELETE FROM scheme WHERE scheme_id = ?",
            [schemeId]
        );

        res.status(200).send({
            success: true,
            message: "Scheme deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error deleting scheme",
            error,
        });
    }
};

module.exports = { getSchemes, getSchemeById, createScheme, updateScheme, deleteScheme };
