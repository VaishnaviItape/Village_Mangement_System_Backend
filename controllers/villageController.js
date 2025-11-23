const db = require("../config/db");

const getVillage = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM village_table");

        if (!data.length) {
            return res.status(404).send({
                success: false,
                message: "No records found",
            });
        }

        res.status(200).send({
            // success: true,
            // message: "All village records",
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching villages",
            error,
        });
    }
};
//get village by id

const getVillageById = async (req, res) => {
    try {
        const villageId = req.params.id;

        console.log("ID received:", villageId); // Debug

        if (!villageId) {
            return res.status(400).send({
                success: false,
                message: "Village ID is required",
            });
        }

        const [data] = await db.query(
            "SELECT * FROM village_table WHERE VillageID = ?",
            [villageId]
        );

        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Village not found",
            });
        }

        res.status(200).send({
            success: true,
            data: data[0],
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching village by ID",
            error,
        });
    }
};

//Create village 
const createVillage = async (req, res) => {
    try {
        const {
            VillageName,
            District,
            State,
            Population,
            Area
        } = req.body
        if (!VillageName || !Population) {
            res.status(500).send({
                success: false,
                message: "Failed to save Village",
            });
        }

        const [data] = await db.query(
            "INSERT INTO village_table (VillageName, District, State, Population, Area) VALUES(?,?,?,?,?)", [VillageName,
            District,
            State,
            Population,
            Area]
        );

        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Error In Insert Query",
            });
        }

        res.status(200).send({
            success: true,
            message: "Village Record Created Successfully",
            data: data[0],
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to save Village",
            error,
        });
    }
};

//Update Village
// const updateVillage = async (req, res) => {
//     try {
//         const villageId = req.params.id;

//         console.log("ID received:", villageId); // Debug

//         if (!villageId) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Village ID is required",
//             });
//         }
//         const {
//             VillageName,
//             District,
//             State,
//             Population,
//             Area
//         } = req.body
//         const [data] = await db.query(
//             "UPDATE village_table SET VillageName = ?, District = ?, State = ? ,Population = ?,Area = ? WHERE VillageID = ? ", [VillageName,
//             District,
//             State,
//             Population,
//             Area, villageId]
//         );

//         if (data.length === 0) {
//             return res.status(500).send({
//                 success: false,
//                 message: "Failed to save Village",
//                 error,
//             });
//         }

//         res.status(200).send({
//             success: true,
//             message: "Village Updated Successfully",
//             data: data[0],
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "Error fetching village by ID",
//             error,
//         });
//     }
// };

//patch Value

const updateVillage = async (req, res) => {
    try {
        const villageId = req.params.id;

        if (!villageId) {
            return res.status(400).send({
                success: false,
                message: "Village ID is required",
            });
        }

        // Step 1: Get existing values
        const [existingData] = await db.query(
            "SELECT * FROM village_table WHERE VillageID = ?",
            [villageId]
        );

        if (existingData.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Village not found",
            });
        }

        const oldData = existingData[0];

        // Step 2: Use new values if provided else keep old values
        const updatedVillage = {
            VillageName: req.body.VillageName || oldData.VillageName,
            District: req.body.District || oldData.District,
            State: req.body.State || oldData.State,
            Population: req.body.Population ?? oldData.Population,
            Area: req.body.Area ?? oldData.Area,
        };

        // Step 3: Update query
        const [result] = await db.query(
            "UPDATE village_table SET VillageName = ?, District = ?, State = ?, Population = ?, Area = ? WHERE VillageID = ?",
            [
                updatedVillage.VillageName,
                updatedVillage.District,
                updatedVillage.State,
                updatedVillage.Population,
                updatedVillage.Area,
                villageId
            ]
        );

        res.status(200).send({
            success: true,
            message: "Village updated successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating village",
            error,
        });
    }
};

//delete Village
const deleteVillage = async (req, res) => {
    try {
        const villageId = req.params.id;

        console.log("ID received:", villageId); // Debug

        if (!villageId) {
            return res.status(400).send({
                success: false,
                message: "Village ID is required",
            });
        }

        const [data] = await db.query(
            "DELETE FROM village_table WHERE VillageID = ?",
            [villageId]
        );

        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Village not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Village Deleted Successfully",
            data: data[0],
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching village by ID",
            error,
        });
    }
};
module.exports = { getVillage, getVillageById, createVillage, updateVillage, deleteVillage };
