const db = require('./config/db');

async function checkSchema() {
    const [rows] = await db.query("DESCRIBE users role;");
    console.log(rows);
    process.exit(0);
}
checkSchema();
