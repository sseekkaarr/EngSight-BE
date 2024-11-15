const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Ambil token dari header Authorization
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        // Verifikasi token dan decode payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Simpan payload dari token ke req.user
        next(); // Lanjutkan ke route berikutnya
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;