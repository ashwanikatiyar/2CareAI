const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Add Vitals Log
router.post('/', authenticateToken, (req, res) => {
    const { date, systolic, diastolic, heart_rate } = req.body;

    db.run('INSERT INTO vitals (user_id, date, systolic, diastolic, heart_rate) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, date, systolic, diastolic, heart_rate], (err) => {
            if (err) return res.status(500).json({ error: 'Failed to add vitals' });
            res.status(201).json({ message: 'Vitals added' });
        });
});

// Get Vitals History
router.get('/', authenticateToken, (req, res) => {
    db.all('SELECT * FROM vitals WHERE user_id = ? ORDER BY date ASC', [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

module.exports = router;
