const express = require("express");
const { getGharPattiBills, createGharPattiBill } = require("../controllers/gharPattiController");

const router = express.Router();

router.get("/ghar-patti", getGharPattiBills);
router.post("/ghar-patti", createGharPattiBill);

module.exports = router;
