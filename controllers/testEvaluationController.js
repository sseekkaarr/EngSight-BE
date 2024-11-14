const fuzz = require("fuzzball");
const TestResult = require("../models/TestResult");

const completePreReadingLab = (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    TestResult.create({
        user_id,
        test_type: "pre_reading_lab",
        score: 100,
        max_score: 100,
        submission_date: new Date(),
    })
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((error) => {
            console.error("Error completing Pre-Reading Lab:", error);
            res.status(500).json({ message: "Failed to complete Pre-Reading Lab" });
        });
};


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

const evaluateEssay = (essay) => {
    let score = 0;

    // 1. Keyword Matching
    const keywords = {
        high: ["Sentiment API", "emotional surveillance", "privacy", "autonomy", "data collection", "consumer trust"],
        medium: ["wearable devices", "Halo", "woke capitalism", "AI-powered analysis", "mental health monitoring", "tech companies"],
        low: ["regulation", "health trends", "user consent", "Big Data", "advertising strategies"],
    };
    const keywordPoints = { high: 5, medium: 3, low: 1 };
    Object.keys(keywords).forEach((level) => {
        keywords[level].forEach((keyword) => {
            const count = (essay.match(new RegExp(keyword, "gi")) || []).length;
            score += count * keywordPoints[level];
        });
    });

    // 2. Struktur Esai
    const structure = {
        intro: essay.includes("This article discusses") || essay.includes("The main focus is"),
        body: essay.includes("Furthermore") || essay.includes("For instance"),
        conclusion: essay.includes("In conclusion") || essay.includes("Finally"),
    };
    score += structure.intro ? 10 : 0;
    score += structure.body ? 10 : 0;
    score += structure.conclusion ? 10 : 0;

    // 3. Panjang Esai
    const wordCount = essay.split(/\s+/).length;
    if (wordCount >= 325 && wordCount <= 475) {
        score += 20;
    } else if (wordCount >= 300 && wordCount <= 500) {
        score += 10;
    }

    // 4. Kualitas Bahasa (dummy logic)
    const grammarScore = 10; // Full points for grammar for now
    score += grammarScore;

    return score;
};

const evaluatePostReadingLab = async (req, res) => {
    try {
        const { essay, user_id } = req.body;

        if (!essay || !user_id) {
            return res.status(400).json({ error: "Essay and User ID are required." });
        }

        const score = evaluateEssay(essay);

        console.log(`Calculated Score: ${score}`); // Debugging

        const result = await TestResult.create({
            user_id: user_id,
            test_type: "post_reading_lab",
            score: score,
            max_score: 100,
            submission_date: new Date(),
        });

        console.log("Post Reading Lab Saved:", result); // Debugging

        res.status(200).json({
            message: "Post Reading Lab evaluated successfully",
            score,
            max_score: 100,
            result,
        });
    } catch (error) {
        console.error("Error evaluating post reading lab:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


const getLastTestResults = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Ambil hasil tes berdasarkan user_id dan test_type
        const preReadingLab = await TestResult.findOne({
            where: { user_id, test_type: "pre_reading_lab" },
            order: [["submission_date", "DESC"]],
        });

        const readingLab = await TestResult.findOne({
            where: { user_id, test_type: "reading_lab" },
            order: [["submission_date", "DESC"]],
        });

        const postReadingLab = await TestResult.findOne({
            where: { user_id, test_type: "post_reading_lab" },
            order: [["submission_date", "DESC"]],
        });

        // Jika hasil tes tidak ditemukan, set nilai default
        res.status(200).json({
            preReadingLab: preReadingLab || { score: 0, max_score: 100, test_type: "pre_reading_lab" },
            readingLab: readingLab || { score: 0, max_score: 100, test_type: "reading_lab" },
            postReadingLab: postReadingLab || { score: 0, max_score: 100, test_type: "post_reading_lab" },
        });
    } catch (error) {
        console.error("Error fetching test results:", error);
        res.status(500).json({ error: "Failed to fetch test results" });
    }
};





module.exports = { completePreReadingLab, evaluateTest, evaluatePostReadingLab, getLastTestResults };