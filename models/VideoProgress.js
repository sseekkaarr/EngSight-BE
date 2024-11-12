const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VideoProgress = sequelize.define('VideoProgress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Nama tabel Users di database
            key: 'id', // Kolom referensi pada tabel Users
        },
        onDelete: 'CASCADE', // Hapus progress jika user dihapus
        onUpdate: 'CASCADE',
    },
    videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sectionName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    watched: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default value untuk watched
    },
}, {
    tableName: 'video_progress', // Nama tabel di database
    timestamps: true, // Tambahkan kolom createdAt dan updatedAt
    underscored: true, // Gunakan format snake_case untuk kolom otomatis
});

module.exports = VideoProgress;
