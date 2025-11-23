const db = require("../config/db");
const bcrypt = require("bcrypt");
const xlsx = require("xlsx");

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM users");

        if (!data.length)
            return res.status(404).send({ success: false, message: "No users found" });

        res.status(200).send({ success: true, data });
    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM users WHERE id=?", [req.params.id]);

        if (!data.length)
            return res.status(404).send({ success: false, message: "User not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

// Create User
exports.createUser = async (req, res) => {
    try {
        const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

        const { full_name, username, email, password, role, is_active } = req.body;

        await db.query(
            "INSERT INTO users (full_name, username, email, password, role, profile_image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [full_name, username, email, password, role, profile_image, is_active]
        );

        res.status(201).send({ success: true, message: "User created successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Server Error" });
    }
};


// Update user
exports.updateUser = async (req, res) => {
    try {
        const { full_name, username, email, password, role, is_active } = req.body;
        const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

        let sql = `UPDATE users 
                   SET full_name=?, username=?, email=?, password=?, role=?, is_active=?`;

        const values = [full_name, username, email, password, role, is_active];

        if (profile_image) {
            sql += `, profile_image=?`;
            values.push(profile_image);
        }

        sql += ` WHERE id=?`;
        values.push(req.params.id);

        await db.query(sql, values);

        res.status(200).send({ success: true, message: "User updated successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Server Error" });
    }
};


// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await db.query("DELETE FROM users WHERE id=?", [id]);
        res.status(200).send({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

// Upload profile picture
exports.uploadProfileImage = async (req, res) => {
    try {
        const id = req.params.id;

        await db.query("UPDATE users SET profile_image=? WHERE id=?", [
            req.file.path,
            id
        ]);

        res.status(200).send({ success: true, path: req.file.path });

    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};

// Bulk Upload users from Excel
exports.uploadUsersBulk = async (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        for (const row of sheet) {
            const hashedPass = await bcrypt.hash(row.password || "12345", 10);
            await db.query(
                "INSERT INTO users (full_name, username, email, password, role) VALUES (?,?,?,?,?)",
                [row.full_name, row.username, row.email, hashedPass, row.role || "admin"]
            );
        }

        res.status(200).send({ success: true, message: "Bulk import successful" });

    } catch (error) {
        res.status(500).send({ success: false, error });
    }
};
