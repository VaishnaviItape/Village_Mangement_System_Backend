const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all notifications
const getNotifications = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM notification");

        if (!data.length) {
            return res.status(404).send({ success: false, message: "No notifications found" });
        }

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching notifications", error });
    }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
    try {
        const notificationId = req.params.id;
        if (!notificationId) return res.status(400).send({ success: false, message: "Notification ID is required" });

        const [data] = await db.query("SELECT * FROM notification WHERE notification_id = ?", [notificationId]);

        if (data.length === 0) return res.status(404).send({ success: false, message: "Notification not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching notification", error });
    }
};

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const { user_id, message, type, status } = req.body;

        if (!user_id || !message) {
            return res.status(400).send({ success: false, message: "user_id and message are required" });
        }

        const notification_id = uuidv4();

        await db.query(
            `INSERT INTO notification 
        (notification_id, user_id, message, type, status) 
       VALUES (?, ?, ?, ?, ?)`,
            [
                notification_id,
                user_id,
                message,
                type || "App",
                status || "Unread"
            ]
        );

        res.status(201).send({
            success: true,
            message: "Notification created successfully",
            data: { notification_id, user_id, message, type: type || "App", status: status || "Unread" }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create notification", error });
    }
};

// Update notification (PATCH)
const updateNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        if (!notificationId) return res.status(400).send({ success: false, message: "Notification ID is required" });

        const [existingData] = await db.query("SELECT * FROM notification WHERE notification_id = ?", [notificationId]);
        if (existingData.length === 0) return res.status(404).send({ success: false, message: "Notification not found" });

        const oldData = existingData[0];

        const updatedNotification = {
            user_id: req.body.user_id || oldData.user_id,
            message: req.body.message || oldData.message,
            type: req.body.type || oldData.type,
            status: req.body.status || oldData.status,
        };

        await db.query(
            `UPDATE notification 
       SET user_id = ?, message = ?, type = ?, status = ? 
       WHERE notification_id = ?`,
            [
                updatedNotification.user_id,
                updatedNotification.message,
                updatedNotification.type,
                updatedNotification.status,
                notificationId,
            ]
        );

        res.status(200).send({ success: true, message: "Notification updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating notification", error });
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        if (!notificationId) return res.status(400).send({ success: false, message: "Notification ID is required" });

        const [result] = await db.query("DELETE FROM notification WHERE notification_id = ?", [notificationId]);
        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Notification not found" });

        res.status(200).send({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting notification", error });
    }
};

module.exports = { getNotifications, getNotificationById, createNotification, updateNotification, deleteNotification };
