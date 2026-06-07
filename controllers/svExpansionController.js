const db = require("../config/db");

// ================= MARKETPLACE =================
exports.getMarketplaceItems = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM marketplace_items ORDER BY created_at DESC");
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch marketplace items", error });
    }
};

exports.addMarketplaceItem = async (req, res) => {
    try {
        const { seller_name, item_type, title, description, price, contact_number } = req.body;
        await db.query(
            "INSERT INTO marketplace_items (seller_name, item_type, title, description, price, contact_number) VALUES (?, ?, ?, ?, ?, ?)",
            [seller_name, item_type, title, description, price, contact_number]
        );
        res.status(201).json({ success: true, message: "Item listed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to list item", error });
    }
};

// ================= HEALTH & SANITATION =================
exports.getHealthRecords = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM health_records ORDER BY created_at DESC");
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch health records", error });
    }
};

exports.addHealthRecord = async (req, res) => {
    try {
        const { type, details, reported_by } = req.body;
        await db.query(
            "INSERT INTO health_records (type, details, reported_by) VALUES (?, ?, ?)",
            [type, details, reported_by]
        );
        res.status(201).json({ success: true, message: "Record added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to add health record", error });
    }
};

// ================= DIGITAL PAYMENTS =================
exports.getPayments = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM digital_payments ORDER BY payment_date DESC");
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch payments", error });
    }
};

exports.processPayment = async (req, res) => {
    try {
        const { user_name, payment_type, amount } = req.body;
        // Simulate a transaction ID
        const transaction_id = "TXN" + Date.now() + Math.floor(Math.random() * 1000);
        
        await db.query(
            "INSERT INTO digital_payments (user_name, payment_type, amount, transaction_id) VALUES (?, ?, ?, ?)",
            [user_name, payment_type, amount, transaction_id]
        );
        res.status(201).json({ success: true, message: "Payment processed successfully", transaction_id });
    } catch (error) {
        res.status(500).json({ success: false, message: "Payment failed", error });
    }
};

// ================= ADVANCED REPORTING =================
exports.getAuditReport = async (req, res) => {
    try {
        // Fetch financial overview
        const [payments] = await db.query("SELECT SUM(amount) as total_income FROM digital_payments WHERE status='Success'");
        const [expenses] = await db.query("SELECT SUM(amount) as total_expense FROM panchayat_expenses");
        
        res.status(200).json({
            success: true,
            data: {
                total_income: payments[0].total_income || 0,
                total_expense: expenses[0].total_expense || 0,
                net_balance: (payments[0].total_income || 0) - (expenses[0].total_expense || 0)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to generate report", error });
    }
};
