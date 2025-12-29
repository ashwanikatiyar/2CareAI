const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');
const path = require('path');

// Multer config for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images and PDFs Only!');
    }
};

const upload = multer({ storage, fileFilter });

// Upload Report
router.post('/upload', authenticateToken, (req, res) => {
    upload.single('report')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err });
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const { type, date, vitals } = req.body;
        // Store vitals if provided separately, or just associate them with the report row
        // For simplicity, we store 'vitals' string in reports table as requested in example
        db.run('INSERT INTO reports (filename, type, date, vitals, user_id) VALUES (?, ?, ?, ?, ?)',
            [req.file.filename, type, date, vitals, req.user.id], function (dbErr) {
                if (dbErr) return res.status(500).json({ error: 'Upload failed' });
                res.json({ message: 'Report uploaded', reportId: this.lastID });
            });
    });
});

// Get User's Reports with Filters
router.get('/', authenticateToken, (req, res) => {
    const { type, date } = req.query;
    let sql = 'SELECT * FROM reports WHERE user_id = ?';
    const params = [req.user.id];

    if (type) {
        sql += ' AND type = ?';
        params.push(type);
    }
    if (date) {
        sql += ' AND date = ?';
        params.push(date);
    }

    sql += ' ORDER BY date DESC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Get Reports shared with current user
router.get('/shared', authenticateToken, (req, res) => {
    // Find shares where viewer_email matches (Assuming we have email logic, but we used username in simplified auth)
    // For this prototype, let's assume we share by 'username' and viewer_email stores 'username'
    // Or we fetch user email. Let's stick to username for simplicity as per prompt example logic using 'viewer_email' but shares might need to be by user_id if we have it?
    // Let's implement sharing by username for simplicity since we don't have email. Table says 'viewer_email', we'll use 'viewer_username' concept.

    // NOTE: In the DB schema 'viewer_email' was used. We will query that field with the current user's username.
    db.all(`
        SELECT r.*, u.username as owner_name 
        FROM reports r
        JOIN shares s ON r.id = s.report_id
        JOIN users u ON r.user_id = u.id
        WHERE s.viewer_email = ?
    `, [req.user.username], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Share Report
router.post('/share', authenticateToken, (req, res) => {
    const { reportId, viewerUsername } = req.body;

    // Verify ownership
    db.get('SELECT user_id FROM reports WHERE id = ?', [reportId], (err, report) => {
        if (err || !report) return res.status(404).json({ error: 'Report not found' });
        if (report.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

        // Add share
        db.run('INSERT INTO shares (report_id, owner_id, viewer_email, role) VALUES (?, ?, ?, ?)',
            [reportId, req.user.id, viewerUsername, 'viewer'], (err) => {
                if (err) return res.status(500).json({ error: 'Share failed' });
                res.json({ message: `Report shared with ${viewerUsername}` });
            });
    });
});


// Delete Report (Owner only)
router.delete('/:id', authenticateToken, (req, res) => {
    // Check if report belongs to user
    db.get('SELECT * FROM reports WHERE id = ?', [req.params.id], (err, report) => {
        if (err || !report) return res.status(404).json({ error: 'Report not found' });
        if (report.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

        // Delete from database
        db.run('DELETE FROM reports WHERE id = ?', [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: 'Deletion failed' });

            // Optional: consistency to also delete from shares table where report_id is this id
            // SQLite might handle this with ON DELETE CASCADE if configured, but let's be explicit if needed.
            // For now, assuming standard deletion.

            // Optional: Delete file from uploads folder using fs.unlink
            // const fs = require('fs');
            // fs.unlink(path.join(__dirname, '../uploads', report.filename), (err) => { if (err) console.error(err); });

            res.json({ message: 'Report deleted' });
        });
    });
});

// Remove Shared Report (Viewer only)
router.delete('/shared/:id', authenticateToken, (req, res) => {
    // Delete from shares table where report_id matches and viewer_email is current user
    // Using user.username as viewer_email based on current logic
    db.run('DELETE FROM shares WHERE report_id = ? AND viewer_email = ?',
        [req.params.id, req.user.username], function (err) {
            if (err) return res.status(500).json({ error: 'Failed to remove shared report' });
            if (this.changes === 0) return res.status(404).json({ error: 'Shared report not found' });
            res.json({ message: 'Removed from shared reports' });
        });
});

module.exports = router;
