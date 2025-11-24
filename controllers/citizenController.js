const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// Get all citizens with VillageName
exports.getCitizens = async (req, res) => {
    try {
        const [data] = await db.query(
            `SELECT c.*, v.VillageName 
       FROM citizen c
       LEFT JOIN village_table v ON c.VillageID = v.VillageID`
        );

        if (!data.length) return res.status(404).send({ success: false, message: "No citizens found" });

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching citizens", error });
    }
};

// Get citizen by ID with VillageName
exports.getCitizenById = async (req, res) => {
    try {
        const citizenId = req.params.id;
        const [data] = await db.query(
            `SELECT c.*, v.VillageName 
       FROM citizen c
       LEFT JOIN village_table v ON c.VillageID = v.VillageID
       WHERE c.user_id = ?`,
            [citizenId]
        );

        if (!data.length) return res.status(404).send({ success: false, message: "Citizen not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching citizen", error });
    }
};

// Create citizen
exports.createCitizen = async (req, res) => {
    try {
        const {
            full_name,
            father_name,
            email,
            mobile,
            password,
            role,
            address,
            dob,
            gender,
            aadhaar_no,
            VillageID,
        } = req.body;

        if (!full_name || !email || !mobile || !password)
            return res.status(400).send({ success: false, message: "Required fields missing" });

        const user_id = uuidv4();
        const password_hash = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO citizen 
      (user_id, full_name, father_name, email, mobile, password_hash, role, address, dob, gender, aadhaar_no, VillageID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, full_name, father_name, email, mobile, password_hash, role || "Citizen", address, dob, gender, aadhaar_no, VillageID]
        );

        res.status(201).send({ success: true, message: "Citizen created successfully", data: { user_id, full_name, email, mobile, role } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create citizen", error });
    }
};

// Update citizen
exports.updateCitizen = async (req, res) => {
    try {
        const citizenId = req.params.id;
        const {
            full_name,
            father_name,
            email,
            mobile,
            password,
            role,
            address,
            dob,
            gender,
            aadhaar_no,
            VillageID,
        } = req.body;

        const [existingData] = await db.query("SELECT * FROM citizen WHERE user_id = ?", [citizenId]);
        if (!existingData.length) return res.status(404).send({ success: false, message: "Citizen not found" });

        const oldData = existingData[0];
        const password_hash = password ? await bcrypt.hash(password, 10) : oldData.password_hash;

        await db.query(
            `UPDATE citizen SET full_name=?, father_name=?, email=?, mobile=?, password_hash=?, role=?, address=?, dob=?, gender=?, aadhaar_no=?, VillageID=? WHERE user_id=?`,
            [
                full_name || oldData.full_name,
                father_name || oldData.father_name,
                email || oldData.email,
                mobile || oldData.mobile,
                password_hash,
                role || oldData.role,
                address || oldData.address,
                dob || oldData.dob,
                gender || oldData.gender,
                aadhaar_no || oldData.aadhaar_no,
                VillageID || oldData.VillageID,
                citizenId
            ]
        );

        res.status(200).send({ success: true, message: "Citizen updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating citizen", error });
    }
};

// Delete citizen
exports.deleteCitizen = async (req, res) => {
    try {
        const citizenId = req.params.id;
        const [result] = await db.query("DELETE FROM citizen WHERE user_id = ?", [citizenId]);
        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Citizen not found" });

        res.status(200).send({ success: true, message: "Citizen deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting citizen", error });
    }
};
