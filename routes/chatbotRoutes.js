const express = require("express");
const { handleChatbotQuery } = require("../controllers/chatbotController");

const router = express.Router();

router.post("/", handleChatbotQuery);

module.exports = router;