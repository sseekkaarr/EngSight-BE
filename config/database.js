const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inisialisasi Sequelize dengan variabel environment
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Tambahkan port agar sesuai dengan Railway
    dialect: 'mysql',
    logging: console.log, // (Opsional) Logging untuk debugging query ke database
});

// Autentikasi koneksi ke database
sequelize.authenticate()
    .then(() => console.log('Connected to MySQL database.'))
    .catch((err) => {
        console.error('Unable to connect to MySQL:', err.message || err);
        process.exit(1); // Keluar dari proses jika koneksi gagal
    });

module.exports = sequelize;
