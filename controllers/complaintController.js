const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all complaints
const getComplaints = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM complaint");

        if (!data.length) {
            return res.status(200).send({ success: true, data: [] });
        }

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching complaints", error });
    }
};

// Get my complaints
const getMyComplaints = async (req, res) => {
    try {
        // Without auth middleware injecting req.user, we can just return all complaints for demo,
        // or optionally filter by a user_id query param if provided.
        const userId = req.query.user_id || req.user?.id;
        let query = "SELECT * FROM complaint";
        let params = [];
        if (userId) {
            query += " WHERE user_id = ?";
            params.push(userId);
        }

        const [data] = await db.query(query, params);
        res.status(200).send({ success: true, data: data || [] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching my complaints", error });
    }
};

// Get complaint by ID
const getComplaintById = async (req, res) => {
    try {
        const complaintId = req.params.id;
        if (!complaintId) return res.status(400).send({ success: false, message: "Complaint ID is required" });

        const [data] = await db.query("SELECT * FROM complaint WHERE complaint_id = ?", [complaintId]);

        if (data.length === 0) return res.status(404).send({ success: false, message: "Complaint not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching complaint", error });
    }
};

// Create a new complaint
const createComplaint = async (req, res) => {
    try {
        let {
            user_id,
            category,
            description,
            title, // optional from mobile app
            location,
            photo_url,
            priority,
            assigned_to,
            status,
        } = req.body;

        // If mobile app passed title, prepend it to description
        if (title) {
            description = `[${title}] ${description}`;
        }

        if (!user_id || !category || !description) {
            // fallback to a dummy user if not provided just so the API doesn't fail
            const [citizen] = await db.query("SELECT user_id FROM citizen LIMIT 1");
            user_id = user_id || (citizen.length ? citizen[0].user_id : null);
            
            if (!user_id || !category || !description) {
                return res.status(400).send({ success: false, message: "user_id, category, and description are required" });
            }
        }

        const complaint_id = uuidv4();

        await db.query(
            `INSERT INTO complaint 
        (complaint_id, user_id, category, description, location, photo_url, priority, status, assigned_to) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                complaint_id,
                user_id,
                category,
                description,
                location ? JSON.stringify(location) : null,
                photo_url || null,
                priority || "Medium",
                status || "Submitted",
                assigned_to || null,
            ]
        );

        res.status(201).send({ success: true, message: "Complaint created successfully", data: { complaint_id, user_id, category, description, location, photo_url, priority, status, assigned_to } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create complaint", error });
    }
};

// Update complaint (PATCH)
const updateComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        if (!complaintId) return res.status(400).send({ success: false, message: "Complaint ID is required" });

        const [existingData] = await db.query("SELECT * FROM complaint WHERE complaint_id = ?", [complaintId]);
        if (existingData.length === 0) return res.status(404).send({ success: false, message: "Complaint not found" });

        const oldData = existingData[0];

        const updatedComplaint = {
            user_id: req.body.user_id || oldData.user_id,
            category: req.body.category || oldData.category,
            description: req.body.description || oldData.description,
            location: req.body.location ? JSON.stringify(req.body.location) : oldData.location,
            photo_url: req.body.photo_url || oldData.photo_url,
            priority: req.body.priority || oldData.priority,
            status: req.body.status || oldData.status,
            assigned_to: req.body.assigned_to || oldData.assigned_to,
        };

        await db.query(
            `UPDATE complaint 
       SET user_id = ?, category = ?, description = ?, location = ?, photo_url = ?, priority = ?, status = ?, assigned_to = ? 
       WHERE complaint_id = ?`,
            [
                updatedComplaint.user_id,
                updatedComplaint.category,
                updatedComplaint.description,
                updatedComplaint.location,
                updatedComplaint.photo_url,
                updatedComplaint.priority,
                updatedComplaint.status,
                updatedComplaint.assigned_to,
                complaintId,
            ]
        );

        res.status(200).send({ success: true, message: "Complaint updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating complaint", error });
    }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        if (!complaintId) return res.status(400).send({ success: false, message: "Complaint ID is required" });

        const [result] = await db.query("DELETE FROM complaint WHERE complaint_id = ?", [complaintId]);
        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Complaint not found" });

        res.status(200).send({ success: true, message: "Complaint deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting complaint", error });
    }
};

module.exports = { getComplaints, getMyComplaints, getComplaintById, createComplaint, updateComplaint, deleteComplaint };
