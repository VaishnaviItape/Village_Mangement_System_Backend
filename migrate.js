const fs = require('fs');
const db = require('./config/db');

async function run() {
    try {
        const sql = fs.readFileSync('new_modules.sql', 'utf8');
        const statements = sql.split(';').filter(s => s.trim().length > 0);
        for (const statement of statements) {
            await db.query(statement);
        }
        console.log("Database tables created successfully.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
