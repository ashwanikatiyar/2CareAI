const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./health_wallet.db');

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // Reports table
  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    type TEXT,
    date TEXT,
    vitals TEXT,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Vitals table for tracking trends separately if needed, or linked to reports
  // For this project, we might extract vitals from reports or add them manually.
  // Let's create a dedicated vitals table for trending.
  db.run(`CREATE TABLE IF NOT EXISTS vitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    systolic INTEGER,
    diastolic INTEGER,
    heart_rate INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Shares table for access control
  db.run(`CREATE TABLE IF NOT EXISTS shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER,
    owner_id INTEGER,
    viewer_email TEXT,
    role TEXT, -- 'viewer'
    FOREIGN KEY(report_id) REFERENCES reports(id),
    FOREIGN KEY(owner_id) REFERENCES users(id)
  )`);
});

module.exports = db;
