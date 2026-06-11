const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    const [tables] = await conn.query('SHOW TABLES');
    const tableKey = `Tables_in_${process.env.DB_NAME}`;
    
    for (const tableRow of tables) {
        const tableName = Object.values(tableRow)[0];
        const [columns] = await conn.query(`DESCRIBE ${tableName}`);
        console.log(`Table: ${tableName}`);
        console.log(columns.map(c => `  ${c.Field} (${c.Type})`).join('\n'));
    }
    process.exit();
}
run();
