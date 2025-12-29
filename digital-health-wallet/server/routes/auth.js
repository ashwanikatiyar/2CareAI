const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { SECRET_KEY } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword],  (err) => {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: 'Registration failed' });
            }
            res.status(201).json({ message: 'User registered', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token, username: user.username });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

module.exports = router;
