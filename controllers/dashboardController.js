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

        const totalGharPattiAmount = parseFloat(getRows(results[15])[0].totalGharPattiAmount) || 0;
        const totalPaniPattiAmount = parseFloat(getRows(results[16])[0].totalPaniPattiAmount) || 0;

        const totalTaxAmount = totalGharPattiAmount + totalPaniPattiAmount;

        // Chart Data Generation
        const taxDistribution = [
            { name: "Ghar Patti", value: parseFloat(totalGharPattiAmount) || 0 },
            { name: "Pani Patti", value: parseFloat(totalPaniPattiAmount) || 0 }
        ];

        // Dynamic data for the last 6 months collection trend
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const collectionTrends = [];
        const currentDate = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            collectionTrends.push({
                name: monthNames[d.getMonth()],
                monthNum: d.getMonth() + 1,
                yearNum: d.getFullYear(),
                GharPatti: 0,
                PaniPatti: 0
            });
        }

        // Fetch aggregated data from gharpatti_bills
        const [gharPattiTrends] = await db.query(`
            SELECT MONTH(createdAt) as m, YEAR(createdAt) as y, SUM(amount) as total
            FROM gharpatti_bills
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY y, m
        `);

        // Fetch aggregated data from panipatti_bills
        const [paniPattiTrends] = await db.query(`
            SELECT MONTH(createdAt) as m, YEAR(createdAt) as y, SUM(amount) as total
            FROM panipatti_bills
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY y, m
        `);

        // Merge into collectionTrends
        collectionTrends.forEach(trend => {
            const gp = gharPattiTrends.find(g => g.m === trend.monthNum && g.y === trend.yearNum);
            if (gp) trend.GharPatti = parseFloat(gp.total) || 0;

            const pp = paniPattiTrends.find(p => p.m === trend.monthNum && p.y === trend.yearNum);
            if (pp) trend.PaniPatti = parseFloat(pp.total) || 0;
        });

        // Clean up helper fields
        collectionTrends.forEach(trend => {
            delete trend.monthNum;
            delete trend.yearNum;
        });

        // Get recent complaints
        const recentComplaintsResult = await db.query(`
            SELECT c.complaint_id as id, c.category as type, c.status, c.created_at as date, 
                   cz.full_name as citizen, v.VillageName as village 
            FROM complaint c 
            LEFT JOIN citizen cz ON c.user_id = cz.user_id 
            LEFT JOIN village_table v ON cz.VillageID = v.VillageID
            ORDER BY c.created_at DESC LIMIT 5
        `).catch(e => {
            console.error("Error fetching recent complaints:", e);
            // Fallback if schema doesn't perfectly match
            return [[]];
        });
        
        const recentComplaints = Array.isArray(recentComplaintsResult[0]) ? recentComplaintsResult[0] : [];

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
                taxDistribution,
                collectionTrends,
                recentComplaints
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
