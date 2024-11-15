const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true, // Aktifkan SSL untuk Railway
            rejectUnauthorized: false, // Untuk melewati verifikasi SSL (Railway-specific)
        },
    },
    logging: console.log, // Log semua query (opsional untuk debugging)
});

// Autentikasi koneksi ke database
sequelize.authenticate()
    .then(() => console.log('Connected to MySQL database.'))
    .catch((err) => {
        console.error('Unable to connect to MySQL:', err.message || err);
        process.exit(1); // Keluar dari proses jika koneksi gagal
    });

module.exports = sequelize;
