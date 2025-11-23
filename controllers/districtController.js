const db = require("../config/db");

// ===================== GET ALL DISTRICTS =====================
const getDistricts = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT d.*, s.state_name 
            FROM districts d
            JOIN states s ON d.state_id = s.id
        `);

        res.status(200).send({
            success: true,
            message: data.length ? "Districts fetched successfully" : "No records found",
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching districts",
            error,
        });
    }
};


// ===================== GET DISTRICT BY ID =====================
const getDistrictById = async (req, res) => {
    try {
        const districtId = req.params.id;

        const [data] = await db.query(
            `SELECT d.*, s.state_name 
             FROM districts d 
             JOIN states s ON d.state_id = s.id
             WHERE d.id = ?`,
            [districtId]
        );

        if (!data.length) {
            return res.status(404).send({
                success: false,
                message: "District not found",
            });
        }

        res.status(200).send({
            success: true,
            data: data[0],
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching district",
            error,
        });
    }
};


// ===================== CREATE DISTRICT =====================
const createDistrict = async (req, res) => {
    try {
        const { district_code, district_name, state_id, is_active } = req.body;

        if (!district_code || !district_name || !state_id) {
            return res.status(400).send({
                success: false,
                message: "district_code, district_name and state_id are required",
            });
        }

        await db.query(
            "INSERT INTO districts (district_code, district_name, state_id, is_active) VALUES (?, ?, ?, ?)",
            [district_code, district_name, state_id, is_active ?? 1]
        );

        res.status(201).send({
            success: true,
            message: "District created successfully",
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to create district",
            error,
        });
    }
};


// ===================== UPDATE DISTRICT =====================
const updateDistrict = async (req, res) => {
    try {
        const districtId = req.params.id;

        const [existing] = await db.query("SELECT * FROM districts WHERE id = ?", [districtId]);
        if (!existing.length) {
            return res.status(404).send({
                success: false,
                message: "District not found",
            });
        }

        const old = existing[0];
        const updated = {
            district_code: req.body.district_code || old.district_code,
            district_name: req.body.district_name || old.district_name,
            state_id: req.body.state_id || old.state_id,
            is_active: req.body.is_active ?? old.is_active,
        };

        await db.query(
            "UPDATE districts SET district_code=?, district_name=?, state_id=?, is_active=? WHERE id=?",
            [updated.district_code, updated.district_name, updated.state_id, updated.is_active, districtId]
        );

        res.status(200).send({
            success: true,
            message: "District updated successfully",
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error updating district",
            error,
        });
    }
};


// ===================== DELETE DISTRICT =====================
const deleteDistrict = async (req, res) => {
    try {
        const districtId = req.params.id;

        const [result] = await db.query("DELETE FROM districts WHERE id = ?", [districtId]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: "District not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "District deleted successfully",
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error deleting district",
            error,
        });
    }
};

module.exports = { getDistricts, getDistrictById, createDistrict, updateDistrict, deleteDistrict };
