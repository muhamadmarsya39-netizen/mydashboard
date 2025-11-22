const Database = require('better-sqlite3');

// Buka database
const db = new Database('data.db');

// Aktifkan WAL (Write-Ahead Logging) supaya SQLite bisa membaca saat menulis
db.pragma('journal_mode = WAL');

// Buat tabel users jika belum ada
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
)
`);

module.exports = db;
