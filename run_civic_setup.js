const db = require('./config/db');
const fs = require('fs');

async function setupCivicTable() {
    try {
        const query = fs.readFileSync('./db_setup_civic.sql', 'utf8');
        await db.query(query);
        console.log("Successfully created civic_registrations table!");
        process.exit(0);
    } catch (error) {
        console.error("Failed to create table:", error);
        process.exit(1);
    }
}

setupCivicTable();
