const db = require('./config/db');
const bcrypt = require('bcrypt');

async function createAccounts() {
    const accounts = [
        { full_name: 'Super Admin User', username: 'superadmin', email: 'superadmin@example.com', password: 'Password123!', role: 'Superadmin' },
        { full_name: 'Admin User', username: 'admin', email: 'admin@example.com', password: 'Password123!', role: 'Admin' },
        { full_name: 'Villager User', username: 'villager', email: 'villager@example.com', password: 'Password123!', role: 'Villager' }
    ];

    for (let acc of accounts) {
        try {
            const [existing] = await db.query("SELECT * FROM users WHERE email=? OR username=?", [acc.email, acc.username]);
            if (existing.length) {
                console.log(`Account ${acc.username} already exists. Skipping.`);
            } else {
                const hashedPassword = await bcrypt.hash(acc.password, 10);
                await db.query(
                    "INSERT INTO users(full_name, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
                    [acc.full_name, acc.username, acc.email, hashedPassword, acc.role]
                );
                console.log(`Account ${acc.username} created successfully.`);
            }
        } catch (err) {
            console.error(`Error creating ${acc.username}:`, err.message);
        }
    }
    process.exit(0);
}

createAccounts();
