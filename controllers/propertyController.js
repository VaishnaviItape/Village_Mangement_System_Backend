const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const XLSX = require("xlsx")

// Get all property
exports.getProperty = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM property");

        if (!data.length)
            return res.status(404).send({ success: false, message: "No property found" });

        res.status(200).send({ success: true, data });

    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM property WHERE property_id=?", [
            req.params.id
        ]);

        if (!data.length)
            return res.status(404).send({ success: false, message: "Property not found" });

        res.status(200).send({ success: true, data: data[0] });

    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

// Create new property
exports.createProperty = async (req, res) => {
    try {
        const property_id = uuidv4();
        const {
            owner_id,
            village_id,
            property_no,
            property_type,
            address,
            area_sq_ft,
            construction_year,
            ownership_type
        } = req.body;

        await db.query(
            `INSERT INTO property 
            (property_id, owner_id, village_id, property_no, property_type, address, area_sq_ft, construction_year, ownership_type, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                property_id,
                owner_id,
                village_id,
                property_no,
                property_type,
                address,
                area_sq_ft,
                construction_year,
                ownership_type
            ]
        );

        res.status(201).send({ success: true, message: "Property added successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Server Error" });
    }
};

// Update property
exports.updateProperty = async (req, res) => {
    try {
        const {
            owner_id,
            village_id,
            property_no,
            property_type,
            address,
            area_sq_ft,
            construction_year,
            ownership_type
        } = req.body;

        await db.query(
            `UPDATE property SET 
                owner_id=?, village_id=?, property_no=?, property_type=?, 
                address=?, area_sq_ft=?, construction_year=?, ownership_type=?, updated_at=NOW()
            WHERE property_id=?`,
            [
                owner_id,
                village_id,
                property_no,
                property_type,
                address,
                area_sq_ft,
                construction_year,
                ownership_type,
                req.params.id
            ]
        );

        res.status(200).send({ success: true, message: "Property updated successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error });
    }
};

// Delete property
exports.deleteProperty = async (req, res) => {
    try {
        await db.query("DELETE FROM property WHERE property_id=?", [req.params.id]);
        res.status(200).send({ success: true, message: "Property deleted successfully" });

    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

exports.bulkUploadProperty = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, message: "Please upload an Excel file." });
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const records = XLSX.utils.sheet_to_json(sheet);

        if (!records.length)
            return res.status(400).send({ success: false, message: "Excel file is empty" });

        let insertValues = records.map(row => [
            uuidv4(),
            row.owner_id,
            row.village_id,
            row.property_no,
            row.property_type,
            row.address,
            row.area_sq_ft,
            row.construction_year,
            row.ownership_type
        ]);

        await db.query(
            `INSERT INTO property 
            (property_id, owner_id, village_id, property_no, property_type, address, area_sq_ft, construction_year, ownership_type, created_at, updated_at)
            VALUES ?`,
            [insertValues.map(v => [...v, new Date(), new Date()])]
        );

        res.status(200).send({
            success: true,
            message: `${records.length} records uploaded successfully!`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error });
    }
};
