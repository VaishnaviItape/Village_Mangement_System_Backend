const express = require("express");
const { getVillage, getVillageById, createVillage, deleteVillage, updateVillage } = require("../controllers/villageController");

const router = express.Router();

// Route: GET all villages
router.get("/villages", getVillage);

//get by Id
router.get('/villages/:id', getVillageById)

//Create Village
router.post('/villages', createVillage)

//Update Village
router.put('/villages/:id', updateVillage)

//Delete Village
router.delete('/villages/:id', deleteVillage)
module.exports = router;
