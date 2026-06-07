const db = require("../config/db");

// --- TRADE LICENSES ---
exports.createTradeLicense = async (req, res) => {
    try {
        const { business_name, business_type, registration_no } = req.body;
        const documentUrl = req.file ? `/uploads/${req.file.filename}` : null;
        await db.query(
            "INSERT INTO trade_licenses (user_id, business_name, business_type, registration_no, document_url) VALUES (?, ?, ?, ?, ?)",
            [req.user.id, business_name, business_type, registration_no, documentUrl]
        );
        res.status(201).send({ success: true, message: "Trade license submitted" });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.getTradeLicenses = async (req, res) => {
    try {
        const [data] = await db.query("SELECT tl.*, u.full_name FROM trade_licenses tl JOIN users u ON tl.user_id = u.id");
        res.status(200).send({ success: true, data });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.getMyTradeLicenses = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM trade_licenses WHERE user_id = ?", [req.user.id]);
        res.status(200).send({ success: true, data });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.updateTradeLicenseStatus = async (req, res) => {
    try {
        await db.query("UPDATE trade_licenses SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
        res.status(200).send({ success: true, message: "Status updated" });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

// --- LAND REGISTRATIONS ---
exports.createLandRegistration = async (req, res) => {
    try {
        const { survey_number, land_area, crop_type } = req.body;
        const documentUrl = req.file ? `/uploads/${req.file.filename}` : null;
        await db.query(
            "INSERT INTO land_registrations (user_id, survey_number, land_area, crop_type, document_url) VALUES (?, ?, ?, ?, ?)",
            [req.user.id, survey_number, land_area, crop_type, documentUrl]
        );
        res.status(201).send({ success: true, message: "Land registration submitted" });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.getLandRegistrations = async (req, res) => {
    try {
        const [data] = await db.query("SELECT lr.*, u.full_name FROM land_registrations lr JOIN users u ON lr.user_id = u.id");
        res.status(200).send({ success: true, data });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.getMyLandRegistrations = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM land_registrations WHERE user_id = ?", [req.user.id]);
        res.status(200).send({ success: true, data });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.updateLandStatus = async (req, res) => {
    try {
        await db.query("UPDATE land_registrations SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
        res.status(200).send({ success: true, message: "Status updated" });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

// --- GRAM SABHA ---
exports.createMeeting = async (req, res) => {
    try {
        const { meeting_date, agenda } = req.body;
        await db.query("INSERT INTO gram_sabha_meetings (meeting_date, agenda) VALUES (?, ?)", [meeting_date, agenda]);
        res.status(201).send({ success: true, message: "Meeting scheduled" });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.getMeetings = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM gram_sabha_meetings ORDER BY meeting_date DESC");
        res.status(200).send({ success: true, data });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.updateMeeting = async (req, res) => {
    try {
        const { minutes, status } = req.body;
        await db.query("UPDATE gram_sabha_meetings SET minutes = ?, status = ? WHERE id = ?", [minutes, status, req.params.id]);
        res.status(200).send({ success: true, message: "Meeting updated" });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

// --- EXPENSES ---
exports.createExpense = async (req, res) => {
    try {
        const { category, amount, description, expense_date } = req.body;
        await db.query("INSERT INTO panchayat_expenses (category, amount, description, expense_date) VALUES (?, ?, ?, ?)", [category, amount, description, expense_date]);
        res.status(201).send({ success: true, message: "Expense logged" });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.getExpenses = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM panchayat_expenses ORDER BY expense_date DESC");
        res.status(200).send({ success: true, data });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

// --- VENDORS ---
exports.createVendor = async (req, res) => {
    try {
        const { name, contact, service_type } = req.body;
        await db.query("INSERT INTO vendors (name, contact, service_type) VALUES (?, ?, ?)", [name, contact, service_type]);
        res.status(201).send({ success: true, message: "Vendor added" });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.getVendors = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM vendors");
        res.status(200).send({ success: true, data });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

// --- ASSET MAINTENANCE ---
exports.createMaintenance = async (req, res) => {
    try {
        const { asset_id, maintenance_date, cost, description } = req.body;
        await db.query("INSERT INTO asset_maintenance (asset_id, maintenance_date, cost, description) VALUES (?, ?, ?, ?)", [asset_id, maintenance_date, cost, description]);
        res.status(201).send({ success: true, message: "Maintenance logged" });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};

exports.getMaintenance = async (req, res) => {
    try {
        const [data] = await db.query("SELECT am.*, i.asset_name FROM asset_maintenance am JOIN infrastructure i ON am.asset_id = i.asset_id");
        res.status(200).send({ success: true, data });
    } catch (e) { res.status(500).send({ success: false, error: e }); }
};
