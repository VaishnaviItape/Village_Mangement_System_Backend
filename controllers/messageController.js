const db = require("../config/db");

const getUnreadMessages = async (req, res) => {
    try {
        // Mock response or actually fetch from database if a messages table exists
        // Since we don't have the table schema for messages, returning an empty array for now
        res.status(200).send({ success: true, count: 0, data: [] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching unread messages", error });
    }
};

module.exports = { getUnreadMessages };
