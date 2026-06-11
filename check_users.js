const db = require('./config/db');

async function check() {
    const [rows] = await db.query("SELECT id, username, email, role FROM users;");
    console.table(rows);
    process.exit(0);
}
check();
