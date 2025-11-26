const db = require("../config/db");

const getPaniPattiBills = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM panipatti_bills");

        res.status(200).send({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching Pani Patti bills",
            error
        });
    }
};

const createPaniPattiBill = async (req, res) => {
    try {
        const {
            ConsumerName,
            ConnectionNumber,
            VillageID,
            MobileNumber,
            AssessmentYear,
            amount,
            paymentStatus,
            paymentMode,
            source
        } = req.body;

        await db.query(
            `INSERT INTO panipatti_bills 
            (ConsumerName, ConnectionNumber, VillageID, MobileNumber, AssessmentYear, amount, paymentStatus, paymentMode, source) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                ConsumerName,
                ConnectionNumber,
                VillageID,
                MobileNumber,
                AssessmentYear,
                amount,
                paymentStatus,
                paymentMode,
                source
            ]
        );

        res.status(201).send({
            success: true,
            message: "Pani Patti Bill Created"
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error creating Pani Patti bill",
            error
        });
    }
};

module.exports = { getPaniPattiBills, createPaniPattiBill };
