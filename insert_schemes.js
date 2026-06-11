const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function insertSchemes() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    const schemes = [
        {
            scheme_id: uuidv4(),
            scheme_name: 'Pradhan Mantri Awas Yojana',
            eligibility_criteria: JSON.stringify({ income: '< 3 Lakhs', occupation: 'Farmer/Laborer' }),
            description: 'Housing for poor villagers. Provides financial assistance to construct pucca houses.',
            start_date: '2026-01-01',
            end_date: '2026-12-31',
            status: 'Active'
        },
        {
            scheme_id: uuidv4(),
            scheme_name: 'Kisan Samman Nidhi',
            eligibility_criteria: JSON.stringify({ land: '< 2 Hectares', profession: 'Farmer' }),
            description: 'Financial support of ₹6000 per year to small and marginal farmers.',
            start_date: '2026-02-01',
            end_date: '2027-02-01',
            status: 'Active'
        },
        {
            scheme_id: uuidv4(),
            scheme_name: 'Jal Jeevan Mission',
            eligibility_criteria: JSON.stringify({ residency: 'Rural areas' }),
            description: 'Aims to provide safe and adequate drinking water through individual household tap connections.',
            start_date: '2026-03-01',
            end_date: '2026-12-31',
            status: 'Active'
        }
    ];

    try {
        for (const scheme of schemes) {
            await pool.query(
                `INSERT INTO scheme (scheme_id, scheme_name, eligibility_criteria, description, start_date, end_date, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [scheme.scheme_id, scheme.scheme_name, scheme.eligibility_criteria, scheme.description, scheme.start_date, scheme.end_date, scheme.status]
            );
            console.log("Inserted scheme: " + scheme.scheme_name);
        }
    } catch (err) {
        console.error('Error inserting schemes:', err);
    } finally {
        await pool.end();
    }
}

insertSchemes();
