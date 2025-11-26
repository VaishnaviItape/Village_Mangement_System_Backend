const db = require("../config/db");

const getGharPattiBills = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM gharpatti_bills");

        res.status(200).send({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching Ghar Patti bills",
            error
        });
    }
};

const createGharPattiBill = async (req, res) => {
    try {
        const {
            HouseOwnerName,
            HouseNumber,
            WardNumber,
            VillageID,
            MobileNumber,
            AssessmentYear,
            amount,
            paymentStatus,
            paymentMode,
            source,
        } = req.body;

        await db.query(
            `INSERT INTO gharpatti_bills 
             (HouseOwnerName, HouseNumber, WardNumber, VillageID, MobileNumber, AssessmentYear, amount, paymentStatus, paymentMode, source) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                HouseOwnerName,
                HouseNumber,
                WardNumber,
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
            message: "Ghar Patti Bill Created"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error creating Ghar Patti bill",
            error
        });
    }
};

module.exports = { getGharPattiBills, createGharPattiBill };
