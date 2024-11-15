const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');


// Rute untuk registrasi pengguna baru
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validasi input
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        // Periksa jika email sudah terdaftar
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat pengguna baru
        const user = await User.create({ email, password: hashedPassword, name });
        return res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Rute untuk login pengguna
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Log input email dan password
        console.log(`Login attempt: Email: ${email}, Password: ${password}`);

        // Cari pengguna berdasarkan email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`User not found for email: ${email}`);
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Log hash password dari database
        console.log(`Found user: ${user.email}, Hashed Password: ${user.password}`);

        // Periksa password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match result: ${isMatch}`);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Buat token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});






// Rute untuk mendapatkan informasi profil pengguna
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email'], // Tambahkan 'id' ke atribut
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user_id: user.id, // Tambahkan user_id ke respons
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
