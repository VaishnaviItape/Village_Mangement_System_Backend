const db = require("../config/db");

// Get all talukas
const getTalukas = async (req, res) => {
    try {
        const sql = `
            SELECT t.id, t.taluka_code, t.taluka_name, t.district_id, t.is_active, d.district_name
            FROM talukas t
            LEFT JOIN districts d ON t.district_id = d.id
        `;
        const [rows] = await db.query(sql);
        res.status(200).send({
            success: true,
            message: "Talukas Fetched Successfully",
            data: rows
        });
    } catch (error) {
        console.error("Error fetching talukas:", error);
        res.status(500).send({
            success: false,
            message: "Error fetching talukas",
            error: error.message
        });
    }
};

// Create taluka
const createTaluka = async (req, res) => {
    try {
        const { taluka_code, taluka_name, district_id, is_active = 1 } = req.body;
        if (!taluka_code || !taluka_name || !district_id) {
            return res.status(400).send({ success: false, message: "taluka_code, taluka_name, district_id are required" });
        }

        const sql = "INSERT INTO talukas (taluka_code, taluka_name, district_id, is_active) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(sql, [taluka_code, taluka_name, district_id, is_active]);

        res.status(201).send({
            success: true,
            message: "Taluka Created Successfully",
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error("Error creating taluka:", error);
        res.status(500).send({
            success: false,
            message: "Error creating taluka",
            error: error.message
        });
    }
};

// Update taluka
const updateTaluka = async (req, res) => {
    try {
        const { id } = req.params;
        const { taluka_code, taluka_name, district_id, is_active } = req.body;
        
        let updates = [];
        let values = [];
        if (taluka_code) { updates.push("taluka_code = ?"); values.push(taluka_code); }
        if (taluka_name) { updates.push("taluka_name = ?"); values.push(taluka_name); }
        if (district_id) { updates.push("district_id = ?"); values.push(district_id); }
        if (is_active !== undefined) { updates.push("is_active = ?"); values.push(is_active); }

        if (updates.length === 0) {
            return res.status(400).send({ success: false, message: "No data provided to update" });
        }

        values.push(id);
        const sql = `UPDATE talukas SET ${updates.join(", ")} WHERE id = ?`;
        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: "Taluka not found" });
        }

        res.status(200).send({
            success: true,
            message: "Taluka Updated Successfully"
        });
    } catch (error) {
        console.error("Error updating taluka:", error);
        res.status(500).send({
            success: false,
            message: "Error updating taluka",
            error: error.message
        });
    }
};

// Delete taluka
const deleteTaluka = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM talukas WHERE id = ?";
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: "Taluka not found" });
        }

        res.status(200).send({
            success: true,
            message: "Taluka Deleted Successfully"
        });
    } catch (error) {
        console.error("Error deleting taluka:", error);
        res.status(500).send({
            success: false,
            message: "Error deleting taluka",
            error: error.message
        });
    }
};

module.exports = {
    getTalukas,
    createTaluka,
    updateTaluka,
    deleteTaluka
};
