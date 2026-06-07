const db = require('./config/db');
const fs = require('fs');

async function setupSmartVillageTables() {
    try {
        const query = fs.readFileSync('./db_setup_smart_village.sql', 'utf8');
        // split by semicolon and filter empty
        const statements = query.split(';').filter(stmt => stmt.trim().length > 0);
        
        for (let stmt of statements) {
            await db.query(stmt);
        }
        
        console.log("Successfully created Smart Village tables!");
        process.exit(0);
    } catch (error) {
        console.error("Failed to create tables:", error);
        process.exit(1);
    }
}

setupSmartVillageTables();
