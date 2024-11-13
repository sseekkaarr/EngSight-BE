const express = require("express");
const { evaluateTest } = require("../controllers/testEvaluationController");
const router = express.Router();

// Route untuk POST evaluate-test
router.post('/evaluate-test', evaluateTest);


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