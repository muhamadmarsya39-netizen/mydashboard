const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Asumsi db.js adalah koneksi database Anda

const app = express();
app.use(express.json());
// Anda mungkin perlu menyesuaikan path ini
app.use(express.static(path.join(__dirname, 'public'))); 

// REGISTER
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 10);
        // KEMBALI MENGGUNAKAN TABLE 'users'
        const stmt = db.prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, datetime('now'))");
        stmt.run(name, email, hash);
        res.json({ message: "Register sukses!" });
    } catch (e) {
        res.json({ error: e.message });
    }
});

// LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // KEMBALI MENGGUNAKAN TABLE 'users'
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.json({ error: "Email tidak ditemukan" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.json({ error: "Password salah" });

    const token = jwt.sign({ id: user.id }, "SECRET_KEY");
    res.json({ token, message: "Login Berhasil!" });
});

// PROFILE (untuk dashboard)
app.get('/profile', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.json({ error: "Token tidak ada" });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        // KEMBALI MENGGUNAKAN TABLE 'users'
        const user = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(decoded.id);
        if (!user) return res.json({ error: "User tidak ditemukan" });
        res.json({ user, message: `Selamat datang, ${user.name}!` });
    } catch (e) {
        res.json({ error: "Token invalid" });
    }
});

// 🚀 ENDPOINT BARU: AMBIL SEMUA DATA USER
app.get('/api/users', (req, res) => {
    try {
        // KEMBALI MENGGUNAKAN TABLE 'users'
        const users = db.prepare("SELECT id, name, email, created_at FROM users").all();
        res.json(users);
    } catch (e) {
        console.error("Error fetching all users:", e.message);
        res.status(500).json({ error: "Gagal mengambil data pengguna dari database." });
    }
});

// **Redirect root ke halaman login**
app.get('/', (req, res) => {
    res.redirect('/html.html'); // halaman login/register
});

// Jalankan server
app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));