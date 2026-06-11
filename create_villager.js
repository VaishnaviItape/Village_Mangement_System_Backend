const db = require('./config/db');
const bcrypt = require('bcrypt');

async function setup() {
    try {
        await db.query("ALTER TABLE users MODIFY COLUMN role enum('admin','superadmin','villager') DEFAULT 'admin';");
        console.log("Updated role enum to include 'villager'.");

        const hashedPassword = await bcrypt.hash('Password123!', 10);
        
        // Ensure superadmin uses lowercase 'superadmin' to match the updated/existing enum if it's case sensitive in node.
        const acc = { full_name: 'Villager User', username: 'villager', email: 'villager@example.com', password: hashedPassword, role: 'villager' };
        
        const [existing] = await db.query("SELECT * FROM users WHERE email=? OR username=?", [acc.email, acc.username]);
        if (existing.length) {
            console.log(`Account ${acc.username} already exists. Skipping.`);
        } else {
            await db.query(
                "INSERT INTO users(full_name, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
                [acc.full_name, acc.username, acc.email, acc.password, acc.role]
            );
            console.log(`Account ${acc.username} created successfully.`);
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
    process.exit(0);
}

setup();
