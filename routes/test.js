const express = require("express");
const { evaluateTest, getTestResults } = require("../controllers/testEvaluationController");
const router = express.Router();


// Endpoint evaluasi tes
router.post("/evaluate-test", evaluateTest);

// Endpoint untuk mendapatkan hasil tes
router.get("/test-results/:user_id", getTestResults);


router.get("/results/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        const results = await TestResult.findAll({
            where: { user_id }
        });

        return res.status(200).json(results);
    } catch (err) {
        console.error("Error Fetching Results:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;