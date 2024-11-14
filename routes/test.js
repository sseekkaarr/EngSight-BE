const express = require("express");
const { completePreReadingLab, evaluateTest, getLastTestResults } = require("../controllers/testEvaluationController");
const router = express.Router();
const TestResult = require("../models/TestResult");

router.post("/complete-pre-reading-lab", completePreReadingLab);


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