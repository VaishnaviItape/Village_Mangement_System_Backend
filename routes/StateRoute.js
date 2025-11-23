const express = require("express");
const { getState, getStateById, createState, updateState, deleteState } = require("../controllers/stateController");

const router = express.Router();

// Route: GET all villages
router.get("/states", getState);

//get by Id
router.get('/states/:id', getStateById)

//Create Village
router.post('/states', createState)

//Update Village
router.put('/states/:id', updateState)

//Delete Village
router.delete('/states/:id', deleteState)
module.exports = router;

