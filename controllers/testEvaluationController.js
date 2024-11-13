const fuzz = require("fuzzball");
const TestResult = require("../models/TestResult");

// Kunci jawaban
const CORRECT_ANSWERS = {
    text_box: {
        Claims: [
            "What we’re witnessing is the worrying union of three big trends.",
            "The wellness industry... really wants as few 'well' people as possible.",
            "Even if Apple doesn’t make the Sentiment API universally available, I fear this collision of technology, quack science, and wokeness isn’t going to end well."
        ],
        Reasons: [
            "Personnel departments morphed into 'Human Resources' and mushroomed with the regulatory explosion of Health and Safety. Now they’re morphing again, pushing into the more unclear 'wellness' business.",
            "Companies take on the role of psychologist, and technology industry is selling wearables that purport to help them.",
            "The global shift to working from home, or WFH, has accelerated this."
        ],
        Backings: [
            "The boss wants to know what you’re doing at all times. Thus, what you thought was your own gear becomes work equipment, including the things you must wear.",
            "In their absence, data fills the void, so judgments become more centralized."
        ],
        Refutations: [
            "Where it might be useful to detect early signs of autism or dementia.",
            "Apple confirmed last week that the sentiment data is at first only available to health researchers."
        ]
    },
    drag_drop: {
        Quack: "Fake or unqualified professional",
        VirtueSignal: "Expressing moral superiority",
        Gleaning: "Gathering information bit by bit",
        PreEmptive: "Acting before an anticipated event",
        Decreed: "Officially ordered or decided"
    }
};

// Fungsi evaluasi isian singkat
const evaluateTextBox = (userAnswers) => {
    let textBoxScore = 0;

    for (let category in CORRECT_ANSWERS.text_box) {
        const userResponse = userAnswers[category]?.trim() || "";
        const correctAnswers = CORRECT_ANSWERS.text_box[category];

        console.log(`Evaluating ${category}: User Response - "${userResponse}"`);

        const bestMatchScore = correctAnswers.reduce((max, answer) => {
            const score = fuzz.ratio(userResponse.toLowerCase(), answer.toLowerCase());
            console.log(`   Comparing with "${answer}" - Match Score: ${score}`);
            return Math.max(max, score);
        }, 0);

        console.log(`Best Match Score for ${category}: ${bestMatchScore}`);

        if (bestMatchScore >= 80) {
            textBoxScore += 25; // Full score for the category
        }
    }

    console.log(`Final Text Box Score: ${textBoxScore}`);
    return textBoxScore; // Maksimum 100
};


// Fungsi evaluasi drag-and-drop
const evaluateDragDrop = (userAnswers) => {
    let dragDropScore = 0;

    for (let question in CORRECT_ANSWERS.drag_drop) {
        const userResponse = userAnswers[question]?.trim() || "";
        const isCorrect = userResponse === CORRECT_ANSWERS.drag_drop[question];
        
        if (isCorrect) {
            dragDropScore += 20; // Setiap jawaban benar bernilai 20
        }

        // Debugging Log
        console.log(`Question: ${question}`);
        console.log(`   User Answer: ${userResponse}`);
        console.log(`   Correct Answer: ${CORRECT_ANSWERS.drag_drop[question]}`);
        console.log(`   Is Correct: ${isCorrect}`);
        console.log(`   Current Score: ${dragDropScore}`);
    }

    return dragDropScore; // Maksimum 100
};


// Fungsi utama untuk evaluasi semua jenis soal
const evaluateTest = async (req, res) => {
    try {
        const { user_id, text_box, drag_drop } = req.body;

        // Validasi input
        if (!user_id || !text_box || !drag_drop) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        // Evaluasi masing-masing bagian
        const textBoxScore = evaluateTextBox(text_box);
        console.log(`Text Box Score: ${textBoxScore}`);

        const dragDropScore = evaluateDragDrop(drag_drop);
        console.log(`Drag-and-Drop Score: ${dragDropScore}`);

        // Hitung skor akhir
        const finalScore = (dragDropScore + textBoxScore) / 2;
        console.log(`Final Score: ${finalScore}`);

        // Simpan ke database
        await TestResult.create({
            user_id,
            test_type: "reading_lab",
            score: finalScore,
            max_score: 100,
        });

        // Kirim respons
        return res.status(200).json({
            user_id,
            dragDropScore,
            textBoxScore,
            finalScore,
            maxScore: 100,
        });
    } catch (err) {
        console.error("Error evaluating test:", err);
        return res.status(500).json({ error: "Internal server error", details: err.message });
    }
};

const getTestResults = async (req, res) => {
    try {
        const { user_id } = req.params;

        console.log(`Fetching test results for user_id: ${user_id}`); // Log tambahan
        const results = await TestResult.findAll({
            where: { user_id },
        });

        if (!results || results.length === 0) {
            console.log("No results found."); // Log tambahan
            return res.status(404).json({ message: "No test results found" });
        }

        console.log("Results fetched:", results); // Log hasil
        return res.status(200).json(results);
    } catch (err) {
        console.error("Error Fetching Results:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { getTestResults, evaluateTest };