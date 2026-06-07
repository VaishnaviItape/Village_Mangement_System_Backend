const db = require("../config/db");

// Get all utility requests (For Admin)
const getAllRequests = async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT u_req.*, u.full_name as user_name, i.asset_name
            FROM utility_requests u_req
            JOIN users u ON u_req.user_id = u.id
            LEFT JOIN infrastructure i ON u_req.asset_id = i.asset_id
            ORDER BY u_req.created_at DESC
        `);
        res.status(200).send({ success: true, data: requests });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching utility requests", error });
    }
};

// Get requests for a specific user
const getMyRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const [requests] = await db.query(`
            SELECT u_req.*, i.asset_name
            FROM utility_requests u_req
            LEFT JOIN infrastructure i ON u_req.asset_id = i.asset_id
            WHERE u_req.user_id = ? 
            ORDER BY u_req.created_at DESC
        `, [userId]);
        res.status(200).send({ success: true, data: requests });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching user requests", error });
    }
};

// Create a new request
const createRequest = async (req, res) => {
    try {
        const { request_type, description, location, asset_id } = req.body;
        const userId = req.user.id;
        
        let documentUrl = null;
        if (req.file) {
            documentUrl = `/uploads/${req.file.filename}`;
        }

        if (!request_type || !location) {
            return res.status(400).send({ success: false, message: "Type and Location are required" });
        }

        await db.query(
            `INSERT INTO utility_requests (user_id, request_type, description, location, asset_id, document_url, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
            [userId, request_type, description || null, location, asset_id || null, documentUrl]
        );

        res.status(201).send({ success: true, message: `${request_type} submitted successfully!` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to submit request", error });
    }
};

// Update status (For Admin)
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).send({ success: false, message: "Invalid status" });
        }

        await db.query(
            "UPDATE utility_requests SET status = ? WHERE id = ?",
            [status, id]
        );

        res.status(200).send({ success: true, message: `Request status updated to ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to update status", error });
    }
};

module.exports = { getAllRequests, getMyRequests, createRequest, updateStatus };
