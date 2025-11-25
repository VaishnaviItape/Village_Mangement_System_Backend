const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware"); // <-- FIX
// REGISTER / ADD USER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

// SEND OTP (Forgot Password)
router.post("/send-otp", authController.sendOtp);

// VERIFY OTP
router.post("/verify-otp", authController.verifyOtp);

// RESET PASSWORD
router.post("/reset-password", authController.resetPassword);

router.get("/me", auth, authController.me);

router.get("/logout", authController.logout);
module.exports = router;
