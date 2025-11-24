const express = require("express");
const {
    getNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// GET all notifications
router.get("/notifications", getNotifications);

// GET notification by ID
router.get("/notifications/:id", getNotificationById);

// CREATE notification
router.post("/notifications", createNotification);

// UPDATE notification
router.patch("/notifications/:id", updateNotification);

// DELETE notification
router.delete("/notifications/:id", deleteNotification);

module.exports = router;
