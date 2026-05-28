const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Get all members
exports.getPanchayatMembers = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM panchayat_members");
        if (!data.length) return res.status(404).send({ success: false, message: "No members found" });

        res.status(200).send({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching members", error });
    }
};

// Get member by ID
exports.getPanchayatMemberById = async (req, res) => {
    try {
        const memberId = req.params.id;
        const [data] = await db.query("SELECT * FROM panchayat_members WHERE member_id = ?", [memberId]);

        if (!data.length) return res.status(404).send({ success: false, message: "Member not found" });

        res.status(200).send({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching member", error });
    }
};

// Create a new member
exports.createPanchayatMember = async (req, res) => {
    try {
        const { member_name, role, term_start_date, term_end_date, contact_info } = req.body;

        if (!member_name || !role) {
            return res.status(400).send({ success: false, message: "member_name and role are required" });
        }

        const member_id = uuidv4();

        await db.query(
            "INSERT INTO panchayat_members (member_id, member_name, role, term_start_date, term_end_date, contact_info) VALUES (?, ?, ?, ?, ?, ?)",
            [member_id, member_name, role, term_start_date || null, term_end_date || null, contact_info || null]
        );

        res.status(201).send({ success: true, message: "Member created successfully", data: { member_id, member_name, role, term_start_date, term_end_date, contact_info } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to create member", error });
    }
};

// Update member
exports.updatePanchayatMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const [existingData] = await db.query("SELECT * FROM panchayat_members WHERE member_id = ?", [memberId]);

        if (!existingData.length) return res.status(404).send({ success: false, message: "Member not found" });

        const oldData = existingData[0];
        const updatedMember = {
            member_name: req.body.member_name || oldData.member_name,
            role: req.body.role || oldData.role,
            term_start_date: req.body.term_start_date ?? oldData.term_start_date,
            term_end_date: req.body.term_end_date ?? oldData.term_end_date,
            contact_info: req.body.contact_info ?? oldData.contact_info
        };

        await db.query(
            `UPDATE panchayat_members 
             SET member_name = ?, role = ?, term_start_date = ?, term_end_date = ?, contact_info = ? 
             WHERE member_id = ?`,
            [updatedMember.member_name, updatedMember.role, updatedMember.term_start_date, updatedMember.term_end_date, updatedMember.contact_info, memberId]
        );

        res.status(200).send({ success: true, message: "Member updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating member", error });
    }
};

// Delete member
exports.deletePanchayatMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const [result] = await db.query("DELETE FROM panchayat_members WHERE member_id = ?", [memberId]);

        if (result.affectedRows === 0) return res.status(404).send({ success: false, message: "Member not found" });

        res.status(200).send({ success: true, message: "Member deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting member", error });
    }
};
