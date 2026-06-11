const db = require("../config/db");

// Get all registrations (For Admin)
const getAllRegistrations = async (req, res) => {
    try {
        const [registrations] = await db.query(`
            SELECT c.*, u.full_name as user_name 
            FROM civic_registrations c
            JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
        `);
        res.status(200).send({ success: true, data: registrations });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching registrations", error });
    }
};

// Get registrations for a specific user
const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;
        const [registrations] = await db.query(
            "SELECT * FROM civic_registrations WHERE user_id = ? ORDER BY created_at DESC", 
            [userId]
        );
        res.status(200).send({ success: true, data: registrations });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching user registrations", error });
    }
};

// Create a new registration
const createRegistration = async (req, res) => {
    try {
        const { type, applicant_name, event_date, location } = req.body;
        const userId = req.user.id;
        
        let documentUrl = null;
        if (req.file) {
            documentUrl = `/uploads/${req.file.filename}`;
        }

        if (!type || !applicant_name || !event_date || !location) {
            return res.status(400).send({ success: false, message: "All required fields must be filled" });
        }

        await db.query(
            `INSERT INTO civic_registrations (user_id, type, applicant_name, event_date, location, document_url, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
            [userId, type, applicant_name, event_date, location, documentUrl]
        );

        res.status(201).send({ success: true, message: `${type} Registration submitted successfully!` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to submit registration", error });
    }
};

// Update registration status (For Admin)
const updateRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).send({ success: false, message: "Invalid status" });
        }

        await db.query(
            "UPDATE civic_registrations SET status = ? WHERE id = ?",
            [status, id]
        );

        res.status(200).send({ success: true, message: `Registration status updated to ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to update status", error });
    }
};

// Delete Registration (For Admin)
const deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM civic_registrations WHERE id = ?", [id]);
        res.status(200).send({ success: true, message: "Registration deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to delete registration", error });
    }
};

module.exports = { getAllRegistrations, getMyRegistrations, createRegistration, updateRegistrationStatus, deleteRegistration };
