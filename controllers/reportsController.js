const db = require("../config/db");

const getRows = (result) => Array.isArray(result[0]) ? result[0] : result;

const getTaxReport = async (req, res) => {
    try {
        const taxTotalsResult = await db.query(`
            SELECT 
                (SELECT SUM(amount) FROM gharpatti_bills WHERE status='paid') as totalGharPattiCollected,
                (SELECT SUM(amount) FROM panipatti_bills WHERE status='paid') as totalPaniPattiCollected
        `).catch(() => [[{ totalGharPattiCollected: 0, totalPaniPattiCollected: 0 }]]);

        const taxData = getRows(taxTotalsResult)[0];

        res.status(200).send({
            success: true,
            data: taxData
        });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error loading tax reports", error });
    }
};

const getComplaintReport = async (req, res) => {
    try {
        const complaintsResult = await db.query(`
            SELECT status, COUNT(*) as count 
            FROM complaint 
            GROUP BY status
        `).catch(() => [[ ]]);
        
        const complaintStatus = getRows(complaintsResult);

        res.status(200).send({
            success: true,
            data: complaintStatus
        });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error loading complaint reports", error });
    }
};

const getUserReport = async (req, res) => {
    try {
        const usersResult = await db.query(`
            SELECT role, COUNT(*) as count 
            FROM users 
            GROUP BY role
        `).catch(() => [[ ]]);

        const recentUsers = await db.query(`
            SELECT full_name, email, role, created_at 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 10
        `).catch(() => [[ ]]);

        const userRoles = getRows(usersResult);
        const latestUsers = getRows(recentUsers);

        res.status(200).send({
            success: true,
            data: {
                usersByRole: userRoles,
                recentRegistrations: latestUsers
            }
        });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error loading user reports", error });
    }
};

module.exports = { getTaxReport, getComplaintReport, getUserReport };
