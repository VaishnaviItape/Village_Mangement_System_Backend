const express = require("express");
const {
    getDistricts,
    getDistrictById,
    createDistrict,
    updateDistrict,
    deleteDistrict
} = require("../controllers/districtController");

const router = express.Router();

router.get("/districts", getDistricts);
router.get("/districts/:id", getDistrictById);
router.post("/districts", createDistrict);
router.put("/districts/:id", updateDistrict);
router.delete("/districts/:id", deleteDistrict);

module.exports = router;
