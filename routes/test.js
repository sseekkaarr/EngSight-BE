const express = require("express");
const { completePreReadingLab, evaluateTest, getLastTestResults, evaluatePostReadingLab } = require("../controllers/testEvaluationController");
const router = express.Router();
const TestResult = require("../models/TestResult");

router.post('/complete-pre-reading-lab', authMiddleware, async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }
        console.log(`Pre-Reading Lab completed by User ID: ${user_id}`);
        res.status(200).json({ message: 'Pre-Reading Lab completed successfully.' });
    } catch (error) {
        console.error('Error completing Pre-Reading Lab:', error.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.post("/evaluatePostReadingLab", evaluatePostReadingLab);


// Endpoint evaluasi tes
router.post("/evaluate-test", evaluateTest);

// Endpoint untuk mendapatkan semua hasil tes user
router.get("/test-results/:user_id", getLastTestResults);

// Endpoint untuk mendapatkan hasil tes terbaru (terakhir submit)
router.get("/test-results/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await TestResult.findOne({
            where: { user_id: userId },
            order: [["submission_date", "DESC"]],
        });
        if (!result) {
            return res.status(404).json({ message: "No test results found" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching test results:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;