const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const vitalRoutes = require('./routes/vitals');

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/vitals', vitalRoutes);

app.get('/', (req, res) => {
    res.send('Digital Health Wallet API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
