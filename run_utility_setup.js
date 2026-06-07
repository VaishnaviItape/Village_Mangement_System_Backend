const db = require('./config/db');
const fs = require('fs');

async function setupUtilityTable() {
    try {
        const query = fs.readFileSync('./db_setup_utility.sql', 'utf8');
        await db.query(query);
        console.log("Successfully created utility_requests table!");
        process.exit(0);
    } catch (error) {
        console.error("Failed to create table:", error);
        process.exit(1);
    }
}

setupUtilityTable();
