const express = require("express");
const { getUnreadMessages } = require("../controllers/messageController");

const router = express.Router();

// GET unread messages
router.get("/unread", getUnreadMessages);

module.exports = router;
