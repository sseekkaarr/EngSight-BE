const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VideoProgress = sequelize.define(
    'VideoProgress',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'video_progress', // Nama tabel tetap snake_case jika di database seperti itu
        timestamps: true,
    }
);

module.exports = VideoProgress;
