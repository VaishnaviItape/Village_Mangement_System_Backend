const express = require('express');
const dotenv = require('dotenv');
const mySqlPool = require('./config/db');
const cors = require('cors');
dotenv.config();
const app = express();

app.use(cors()); // <--- Enable CORS here (MUST be before routes)
app.use(express.json());


app.use('/api/auth/', require('./routes/authRoutes'));
// Routes
app.use('/api/', require('./routes/applicationRoutes'));
app.use('/api/', require('./routes/citizenRoutes'));
app.use('/api/', require('./routes/complaintRoutes'));
app.use('/api/', require('./routes/DistrictRoute'));
app.use('/api/', require('./routes/propertyRoutes'));
app.use('/api/', require('./routes/notificationRoutes'));
app.use('/api/', require('./routes/schemaRoute'));
app.use('/api/', require('./routes/schemeApplicationsRoutes'));
app.use('/api/', require('./routes/StateRoute'));
app.use('/api/', require('./routes/taxRoutes'));
app.use('/api/', require('./routes/userRoutes'));
app.use('/api/', require('./routes/VillageRoute'));

app.get('/', (req, res) => {
    res.send("Server Working!");
});

const PORT = process.env.PORT || 8000;

mySqlPool.query('SELECT 1')
    .then(() => console.log("DB connected to:", process.env.DB_NAME),
        console.log("MySQL connected"),
        console.log("DB connected to:", process.env.DB_NAME)
    )
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
