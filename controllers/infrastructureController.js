const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all infrastructure assets
exports.getInfrastructure = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM infrastructure");
        if (!data.length) return res.status(200).send({ success: true, data: [] });

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching infrastructure", error });
    }
};

// Get infrastructure asset by ID
exports.getInfrastructureById = async (req, res) => {
    try {
        const assetId = req.params.id;
        const [data] = await db.query("SELECT * FROM infrastructure WHERE asset_id = ?", [assetId]);

        if (!data.length) return res.status(404).send({ success: false, message: "Asset not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching asset", error });
    }
};

// Create a new infrastructure asset
exports.createInfrastructure = async (req, res) => {
    try {
        const { asset_name, asset_type, status, maintained_by } = req.body;

        if (!asset_name || !asset_type) {
            return res.status(400).send({ success: false, message: "asset_name and asset_type are required" });
        }

        const asset_id = uuidv4();

        await db.query(
            "INSERT INTO infrastructure (asset_id, asset_name, asset_type, status, maintained_by) VALUES (?, ?, ?, ?, ?)",
            [asset_id, asset_name, asset_type, status || 'Good', maintained_by || null]
        );

        res.status(201).send({ success: true, message: "Asset created successfully", data: { asset_id, asset_name, asset_type, status, maintained_by } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create asset", error });
    }
};

// Update infrastructure asset
exports.updateInfrastructure = async (req, res) => {
    try {
        const assetId = req.params.id;
        const [existingData] = await db.query("SELECT * FROM infrastructure WHERE asset_id = ?", [assetId]);

        if (!existingData.length) return res.status(404).send({ success: false, message: "Asset not found" });

        const oldData = existingData[0];
        const updatedAsset = {
            asset_name: req.body.asset_name || oldData.asset_name,
            asset_type: req.body.asset_type || oldData.asset_type,
            status: req.body.status || oldData.status,
            maintained_by: req.body.maintained_by ?? oldData.maintained_by
        };

        await db.query(
            `UPDATE infrastructure 
             SET asset_name = ?, asset_type = ?, status = ?, maintained_by = ? 
             WHERE asset_id = ?`,
            [updatedAsset.asset_name, updatedAsset.asset_type, updatedAsset.status, updatedAsset.maintained_by, assetId]
        );

        res.status(200).send({ success: true, message: "Asset updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating asset", error });
    }
};

// Delete infrastructure asset
exports.deleteInfrastructure = async (req, res) => {
    try {
        const assetId = req.params.id;
        const [result] = await db.query("DELETE FROM infrastructure WHERE asset_id = ?", [assetId]);

        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Asset not found" });

        res.status(200).send({ success: true, message: "Asset deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting asset", error });
    }
};
