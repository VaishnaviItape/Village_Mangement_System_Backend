const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

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

module.exports = router;
