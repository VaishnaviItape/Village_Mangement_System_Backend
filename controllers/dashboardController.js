const db = require("../config/db");

const getDashboardStats = async (req, res) => {
    try {
        // Execute all queries in parallel
        const results = await Promise.all([
            db.query("SELECT COUNT(*) AS count FROM applications"),
            db.query("SELECT COUNT(*) AS count FROM citizen"),
            db.query("SELECT COUNT(*) AS count FROM complaint"),
            db.query("SELECT COUNT(*) AS count FROM districts"),
            db.query("SELECT COUNT(*) AS count FROM documents"),
            db.query("SELECT COUNT(*) AS count FROM notification"),
            db.query("SELECT COUNT(*) AS count FROM property"),
            db.query("SELECT COUNT(*) AS count FROM scheme"),
            db.query("SELECT COUNT(*) AS count FROM scheme_applications"),
            db.query("SELECT COUNT(*) AS count FROM states"),
            db.query("SELECT COUNT(*) AS count FROM users"),
            db.query("SELECT COUNT(*) AS count FROM village_table"),
            db.query("SELECT COUNT(*) AS totalTax FROM tax"),
            db.query("SELECT COUNT(*) AS totalGharPatti FROM gharpatti_bills"),
            db.query("SELECT COUNT(*) AS totalPaniPatti FROM panipatti_bills"),
            db.query("SELECT SUM(amount) AS totalGharPattiAmount FROM gharpatti_bills"),
            db.query("SELECT SUM(amount) AS totalPaniPattiAmount FROM panipatti_bills"),
        ]);

        // Helper to safely get rows (handles mysql2 [rows, fields] or just rows)
        const getRows = (result) => Array.isArray(result[0]) ? result[0] : result;

        const applications = getRows(results[0])[0].count || 0;
        const citizens = getRows(results[1])[0].count || 0;
        const complaints = getRows(results[2])[0].count || 0;
        const districts = getRows(results[3])[0].count || 0;
        const documents = getRows(results[4])[0].count || 0;
        const notifications = getRows(results[5])[0].count || 0;
        const properties = getRows(results[6])[0].count || 0;
        const schemes = getRows(results[7])[0].count || 0;
        const schemeApplications = getRows(results[8])[0].count || 0;
        const states = getRows(results[9])[0].count || 0;
        const users = getRows(results[10])[0].count || 0;
        const villages = getRows(results[11])[0].count || 0;
        const totalTaxEntries = getRows(results[12])[0].totalTax || 0;
        const totalGharPattiBills = getRows(results[13])[0].totalGharPatti || 0;
        const totalPaniPattiBills = getRows(results[14])[0].totalPaniPatti || 0;

        const totalGharPattiAmount = getRows(results[15])[0].totalGharPattiAmount || 0;
        const totalPaniPattiAmount = getRows(results[16])[0].totalPaniPattiAmount || 0;

        const totalTaxAmount = totalGharPattiAmount + totalPaniPattiAmount;

        res.status(200).send({
            success: true,
            message: "Dashboard Data Loaded Successfully",
            data: {
                applications,
                citizens,
                complaints,
                districts,
                documents,
                notifications,
                properties,
                schemes,
                schemeApplications,
                states,
                users,
                villages,
                totalTaxEntries,
                totalGharPattiBills,
                totalPaniPattiBills,
                totalGharPattiAmount,
                totalPaniPattiAmount,
                totalTaxAmount,
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).send({
            success: false,
            message: "Error loading dashboard",
            error
        });
    }
};

module.exports = { getDashboardStats };
