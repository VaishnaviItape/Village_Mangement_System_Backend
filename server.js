const express = require('express');
const dotenv = require('dotenv');
const mySqlPool = require('./config/db');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/auth/', require('./routes/authRoutes'));
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
app.use('/api/', require('./routes/dashboardRoutes'));
app.use('/api/', require('./routes/gharPattiRoutes'));
app.use('/api/', require('./routes/paniPattiRoutes'));
app.use('/api/', require('./routes/certificatesRoutes'));
app.use('/api/', require('./routes/panchayatMembersRoutes'));
app.use('/api/', require('./routes/infrastructureRoutes'));
app.use('/api/', require('./routes/talukaRoutes'));
app.use('/api/', require('./routes/reportsRoutes'));
app.use('/api/', require('./routes/civicRoutes'));
app.use('/api/', require('./routes/utilityRoutes'));
app.use('/api/sv/', require('./routes/svRoutes'));
app.use('/api/sv/', require('./routes/svExpansionRoutes'));
app.use('/Messaging', require('./routes/messageRoutes'));

app.get('/', (req, res) => {
    res.send("Server Working!");
});
const PORT = process.env.PORT || 8080;

mySqlPool.query('SELECT 1')
    .then(() => {
        console.log("MySQL connected");
        console.log("DB connected to:", process.env.DB_NAME);
    })
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
