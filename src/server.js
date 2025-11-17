const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/villages", require("./routes/village.routes"));

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
