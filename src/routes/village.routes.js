const router = require("express").Router();
const auth = require("../middleware/auth");
const village = require("../controllers/village.controller");

router.post("/", auth, village.createVillage);
router.get("/", auth, village.getVillages);
router.put("/:id", auth, village.updateVillage);
router.delete("/:id", auth, village.deleteVillage);

module.exports = router;
