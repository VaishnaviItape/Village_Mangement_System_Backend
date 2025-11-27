const db = require("../config/db");

// Helper to parse message
function parseUserMessage(message) {
    const m = message.toLowerCase();

    // --- SCHEMES ---
    if (m.includes("all schemes") || m.includes("show schemes")) {
        return { sql: "SELECT * FROM scheme", params: [] };
    }
    if (m.includes("scheme details")) {
        // Safe check to ensure we don't crash if "scheme" is the last word
        const parts = m.split("scheme");
        const schemeName = parts.length > 1 ? parts[1].trim() : "";
        return {
            // MAKE SURE 'scheme_name' matches the column in your DB!
            sql: "SELECT * FROM scheme WHERE scheme_name LIKE ?",
            params: [`%${schemeName}%`]
        };
    }

    // --- USERS ---
    if (m.includes("user info")) {
        const parts = m.split("user");
        const name = parts.length > 1 ? parts[1].trim() : "";
        return {
            sql: "SELECT * FROM users WHERE name LIKE ?",
            params: [`%${name}%`]
        };
    }

    // --- VILLAGE ---
    if (m.includes("village info")) {
        const parts = m.split("village");
        const v = parts.length > 1 ? parts[1].trim() : "";
        return {
            sql: "SELECT * FROM village_table WHERE village_name LIKE ?",
            params: [`%${v}%`]
        };
    }

    // --- BILLS ---
    if (m.includes("ghar patti") || m.includes("gharpatti")) {
        return { sql: "SELECT * FROM gharpatti_bills", params: [] };
    }
    if (m.includes("pani patti") || m.includes("panipatti")) {
        return { sql: "SELECT * FROM panipatti_bills", params: [] };
    }

    // --- COMPLAINTS ---
    if (m.includes("complaint")) {
        return { sql: "SELECT * FROM complaint", params: [] };
    }

    return null;
}

exports.handleChatbotQuery = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message required" });

        const parsed = parseUserMessage(message);

        // 1. If bot doesn't understand
        if (!parsed) {
            return res.json({
                success: false,
                reply: "❌ I didn't understand. Try 'Show all schemes' or 'Village info [name]'."
            });
        }

        // 2. Execute SQL
        const [rows] = await db.execute(parsed.sql, parsed.params);

        // 3. Format the output for the chatbot
        // If data found, return it. If empty, say so.
        const replyData = rows.length > 0 ? rows : "No records found for your query.";

        return res.json({
            success: true,
            reply: replyData
        });

    } catch (err) {
        console.error("Database Error:", err.message);
        // Return the specific SQL error so you can see it in the frontend/console
        res.status(500).json({
            success: false,
            reply: `Database Error: ${err.message}`
        });
    }
};