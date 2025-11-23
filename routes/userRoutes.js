const express = require("express");
const router = express.Router();
const upload = require("../middlewares/fileUpload");
const { getUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");

router.get("/users", getUsers);

router.post("/users", upload.single("profile_image"), createUser);

router.put("/users/:id", upload.single("profile_image"), updateUser);

router.delete("/users/:id", deleteUser);

module.exports = router;
