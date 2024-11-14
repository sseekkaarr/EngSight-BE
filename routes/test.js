const express = require("express");
const { evaluateTest, getTestResults } = require("../controllers/testEvaluationController");
const router = express.Router();
const TestResult = require("../models/TestResult");

// Endpoint evaluasi tes
router.post("/evaluate-test", evaluateTest);

// Endpoint untuk mendapatkan semua hasil tes user
router.get("/test-results/:user_id", getTestResults);

// Endpoint untuk mendapatkan hasil tes terbaru (terakhir submit)
router.get("/test-results/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Query untuk mengambil data hasil tes
        const results = await TestResult.findAll({
            where: { user_id: userId },
            order: [["submission_date", "DESC"]], // Urutkan berdasarkan tanggal terbaru
        });

        if (!results.length) {
            return res.status(404).json({ message: "No test results found" });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching test results:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
