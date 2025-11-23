const db = require("../config/db");

// ===================== GET ALL STATES =====================
const getState = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM states");

        res.status(200).send({
            success: true,
            message: data.length ? "States fetched successfully" : "No records found",
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching states",
            error,
        });
    }
};


// ===================== GET STATE BY ID =====================
const getStateById = async (req, res) => {
    try {
        const stateId = req.params.id;

        if (!stateId) {
            return res.status(400).send({
                success: false,
                message: "State ID is required",
            });
        }

        const [data] = await db.query(
            "SELECT * FROM states WHERE id = ?",
            [stateId]
        );

        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "State not found",
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
            message: "Error fetching state by ID",
            error,
        });
    }
};


// ===================== CREATE STATE =====================
const createState = async (req, res) => {
    try {
        const { state_code, state_name, is_active } = req.body;

        if (!state_code || !state_name) {
            return res.status(400).send({
                success: false,
                message: "state_code and state_name are required",
            });
        }

        const [data] = await db.query(
            "INSERT INTO states (state_code, state_name, is_active) VALUES (?, ?, ?)",
            [state_code, state_name, is_active ?? 1]
        );

        res.status(201).send({
            success: true,
            message: "State created successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to create state",
            error,
        });
    }
};


// ===================== UPDATE STATE =====================
const updateState = async (req, res) => {
    try {
        const stateId = req.params.id;

        if (!stateId) {
            return res.status(400).send({
                success: false,
                message: "State ID is required",
            });
        }

        const [existingData] = await db.query("SELECT * FROM states WHERE id = ?", [stateId]);

        if (!existingData.length) {
            return res.status(404).send({
                success: false,
                message: "State not found",
            });
        }

        const oldData = existingData[0];

        const updatedState = {
            state_code: req.body.state_code || oldData.state_code,
            state_name: req.body.state_name || oldData.state_name,
            is_active: req.body.is_active ?? oldData.is_active,
        };

        await db.query(
            "UPDATE states SET state_code = ?, state_name = ?, is_active = ? WHERE id = ?",
            [updatedState.state_code, updatedState.state_name, updatedState.is_active, stateId]
        );

        res.status(200).send({
            success: true,
            message: "State updated successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating state",
            error,
        });
    }
};


// ===================== DELETE STATE =====================
const deleteState = async (req, res) => {
    try {
        const stateId = req.params.id;

        if (!stateId) {
            return res.status(400).send({
                success: false,
                message: "State ID is required",
            });
        }

        const [result] = await db.query("DELETE FROM states WHERE id = ?", [stateId]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: "State not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "State deleted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error deleting state",
            error,
        });
    }
};


module.exports = { getState, getStateById, createState, updateState, deleteState };
