const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;
const OTP_EXPIRY_MINUTES = 5;

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [userRows] = await db.query(
            "SELECT * FROM users WHERE email=? OR username=?",
            [email, email]
        );

        if (!userRows.length)
            return res.status(404).send({ success: false, message: "Invalid Email or Password" });

        const user = userRows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).send({ success: false, message: "Invalid Email or Password" });

        if (!user.is_active)
            return res.status(403).send({ success: false, message: "Account disabled by admin" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).send({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Server Error" });
    }
};



// ---------------- REGISTER / ADD USER ----------------
exports.register = async (req, res) => {
    const { full_name, username, email, password, role } = req.body;

    try {
        const [existing] = await db.query("SELECT * FROM users WHERE email=?", [email]);
        if (existing.length)
            return res.status(400).send({ success: false, message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users(full_name, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
            [full_name, username, email, hashedPassword, role]
        );

        res.status(201).send({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Server Error" });
    }
};

// ---------------- SEND OTP ----------------
exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email=?", [email]);
        if (!users.length)
            return res.status(404).send({ success: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

        await db.query("UPDATE users SET otp=?, otp_expiry=? WHERE email=?", [otp, otpExpiry, email]);

        console.log("OTP Sent:", otp); // Replace with email/SMS in production

        res.send({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

// ---------------- VERIFY OTP ----------------
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email=? AND otp=?", [email, otp]);
        if (!rows.length) return res.status(400).send({ success: false, message: "Invalid OTP" });

        const user = rows[0];
        if (Date.now() > user.otp_expiry) return res.status(400).send({ success: false, message: "OTP expired" });

        const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });

        res.send({ success: true, message: "OTP Verified", resetToken });

    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(401).send({ success: false, message: "Token required" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const hashedPass = await bcrypt.hash(newPassword, 10);

        await db.query(
            "UPDATE users SET password=?, otp=NULL, otp_expiry=NULL WHERE id=?",
            [hashedPass, decoded.id]
        );

        res.send({ success: true, message: "Password reset successful" });

    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

// ---------------- RESET PASSWORD ----------------
exports.me = async (req, res) => {
    try {
        const userId = req.user.id; // comes from JWT decode
        const [rows] = await db.query("SELECT id, full_name, username, email, role, is_active FROM users WHERE id=?", [userId]);

        if (!rows.length)
            return res.status(404).send({ success: false, message: "User not found" });

        return res.send({
            success: true,
            user: rows[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error });
    }
};

exports.logout = async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token)
        return res.status(400).send({ success: false, message: "Token missing" });

    // Optional: Add token to blacklist table if using blacklist strategy
    // await db.query("INSERT INTO token_blacklist (token) VALUES (?)", [token]);

    return res.status(200).send({
        success: true,
        message: "Logged out successfully"
    });
};

