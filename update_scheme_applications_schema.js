const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log("Checking if documents column exists...");
        const [columns] = await pool.query("SHOW COLUMNS FROM scheme_applications LIKE 'documents'");
        if (columns.length === 0) {
            console.log("Adding documents column...");
            await pool.query("ALTER TABLE scheme_applications ADD COLUMN documents JSON");
            console.log("Column 'documents' added successfully.");
        } else {
            console.log("Column 'documents' already exists.");
        }

        await pool.end();
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
