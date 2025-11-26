const express = require("express");
const { getPaniPattiBills, createPaniPattiBill } = require("../controllers/paniPattiController");

const router = express.Router();

router.get("/pani-patti", getPaniPattiBills);
router.post("/pani-patti", createPaniPattiBill);

module.exports = router;
