const VideoProgress = require('../models/VideoProgress');

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
exports.getVideoProgress = async (req, res) => {
    try {
        const { userId } = req.query;

        console.log("Fetching progress for user_id:", userId); // Debug query parameter

        const progress = await VideoProgress.findAll({
            where: { userId },
            attributes: ['videoId', 'sectionName', 'watched'],
        });

        console.log("Query result:", progress); // Debug hasil query ke database
        res.status(200).json(progress);
    } catch (error) {
        console.error("Error fetching video progress:", error);
        res.status(500).json({ message: "Error fetching video progress", error });
    }
};

