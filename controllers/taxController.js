const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all taxes
const getTaxes = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM tax");

        if (!data.length) {
            return res.status(404).send({
                success: false,
                message: "No tax records found",
            });
        }

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching tax records",
            error,
        });
    }
};

// Get tax by ID
const getTaxById = async (req, res) => {
    try {
        const taxId = req.params.id;
        if (!taxId) {
            return res.status(400).send({ success: false, message: "Tax ID is required" });
        }

        const [data] = await db.query("SELECT * FROM tax WHERE tax_id = ?", [taxId]);

        if (data.length === 0) {
            return res.status(404).send({ success: false, message: "Tax record not found" });
        }

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching tax record", error });
    }
};

// Create tax
const createTax = async (req, res) => {
    try {
        const {
            user_id,
            property_id,
            village_id,
            property_no,
            tax_type,
            amount,
            due_date,
            status,
        } = req.body;

        if (!user_id || !property_id || !village_id || !tax_type || !amount || !due_date) {
            return res.status(400).send({ success: false, message: "Required fields are missing" });
        }

        const tax_id = uuidv4();

        await db.query(
            `INSERT INTO tax 
      (tax_id, user_id, property_id, village_id, property_no, tax_type, amount, due_date, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [tax_id, user_id, property_id, village_id, property_no || null, tax_type, amount, due_date, status || "Pending"]
        );

        res.status(201).send({ success: true, message: "Tax record created successfully", data: { tax_id, user_id, property_id, village_id, property_no, tax_type, amount, due_date, status } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create tax record", error });
    }
};

// Update tax (PATCH)
const updateTax = async (req, res) => {
    try {
        const taxId = req.params.id;
        if (!taxId) return res.status(400).send({ success: false, message: "Tax ID is required" });

        const [existingData] = await db.query("SELECT * FROM tax WHERE tax_id = ?", [taxId]);
        if (existingData.length === 0) return res.status(404).send({ success: false, message: "Tax record not found" });

        const oldData = existingData[0];

        const updatedTax = {
            user_id: req.body.user_id || oldData.user_id,
            property_id: req.body.property_id || oldData.property_id,
            village_id: req.body.village_id || oldData.village_id,
            property_no: req.body.property_no || oldData.property_no,
            tax_type: req.body.tax_type || oldData.tax_type,
            amount: req.body.amount ?? oldData.amount,
            due_date: req.body.due_date || oldData.due_date,
            status: req.body.status || oldData.status,
        };

        await db.query(
            `UPDATE tax SET user_id = ?, property_id = ?, village_id = ?, property_no = ?, tax_type = ?, amount = ?, due_date = ?, status = ? WHERE tax_id = ?`,
            [
                updatedTax.user_id,
                updatedTax.property_id,
                updatedTax.village_id,
                updatedTax.property_no,
                updatedTax.tax_type,
                updatedTax.amount,
                updatedTax.due_date,
                updatedTax.status,
                taxId,
            ]
        );

        res.status(200).send({ success: true, message: "Tax record updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating tax record", error });
    }
};

// Delete tax
const deleteTax = async (req, res) => {
    try {
        const taxId = req.params.id;
        if (!taxId) return res.status(400).send({ success: false, message: "Tax ID is required" });

        const [result] = await db.query("DELETE FROM tax WHERE tax_id = ?", [taxId]);

        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Tax record not found" });

        res.status(200).send({ success: true, message: "Tax record deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting tax record", error });
    }
};

module.exports = { getTaxes, getTaxById, createTax, updateTax, deleteTax };
