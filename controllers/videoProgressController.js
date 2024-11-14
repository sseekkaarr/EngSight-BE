const sequelize = require("../config/database");
const VideoProgress = require("../models/VideoProgress");

exports.trackVideoProgress = async (req, res) => {
    const { userId, videoId, sectionName } = req.body;

    try {
        const existingRecord = await VideoProgress.findOne({
            where: { userId, videoId },
        });

        if (existingRecord) {
            return res.status(200).json({ message: 'Video already tracked' });
        }

        await VideoProgress.create({
            userId,
            videoId,
            sectionName,
            watched: true,
        });

        res.status(201).json({ message: 'Progress tracked successfully' });
    } catch (error) {
        console.error('Error tracking video progress:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Simpan progress video
exports.saveVideoProgress = async (req, res) => {
    try {
        const { userId, videoId, sectionName } = req.body;

        console.log("Saving progress:", { userId, videoId, sectionName }); // Debug data yang diterima

        const existingProgress = await VideoProgress.findOne({
            where: { userId, videoId },
        });

        if (existingProgress) {
            console.log("Progress already recorded:", existingProgress); // Debug jika data sudah ada
            return res.status(200).json({ message: 'Progress already recorded' });
        }

        const newProgress = await VideoProgress.create({
            userId,
            videoId,
            sectionName,
            watched: true,
        });

        console.log("Progress saved successfully:", newProgress); // Debug data yang disimpan
        res.status(201).json(newProgress);
    } catch (error) {
        console.error('Error saving video progress:', error);
        res.status(500).json({ message: 'Error saving video progress', error });
    }
};


// Ambil progress video


// Ambil progress video
exports.getVideoProgress = async (req, res) => {
    const { userId } = req.params;

    try {
        // Query dengan join ke tabel master video untuk menghitung total video per section
        const progress = await sequelize.query(
            `
            SELECT
                v.sectionName,
                COUNT(v.id) AS totalVideos,
                COUNT(vp.id) AS watchedVideos,
                (COUNT(vp.id) / COUNT(v.id)) * 100 AS progress
            FROM videos v
            LEFT JOIN video_progress vp
                ON v.id = vp.videoId AND vp.userId = :userId
            GROUP BY v.sectionName
            `,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { userId },
            }
        );

        res.status(200).json({ progress });
    } catch (error) {
        console.error("Error fetching video progress:", error);
        res.status(500).json({ message: "Error fetching video progress", error });
    }
};


