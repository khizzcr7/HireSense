const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const crypto = require("crypto");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({}); // Automatically picks GEMINI_API_KEY from .env
const upload = multer({ storage: multer.memoryStorage() });

// ⚡ Bolt: LRU Cache to avoid redundant external AI calls and parsing for duplicate requests
const analyzeCache = new Map();
const CACHE_MAX_SIZE = 100;

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    const { jobTitle, jobDesc } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Resume file missing or not uploaded." });
    }

    console.log("Uploaded resume:", req.file.originalname);

    // ⚡ Bolt: Generate cache key based on file content and request parameters
    const fileHash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");
    const cacheKey = `${fileHash}|${jobTitle}|${jobDesc || ""}`;

    if (analyzeCache.has(cacheKey)) {
      console.log("⚡ Bolt: Cache hit for resume:", req.file.originalname);
      // Maintain LRU order by deleting and re-inserting
      const cachedFeedback = analyzeCache.get(cacheKey);
      analyzeCache.delete(cacheKey);
      analyzeCache.set(cacheKey, cachedFeedback);
      return res.json({ feedback: cachedFeedback });
    }

    // ⚡ Bolt: Use memory buffer instead of disk I/O to avoid latency from writing/reading files
    const parsed = await pdfParse(req.file.buffer);
    const resumeText = parsed.text;

    const prompt = `
You're an expert tech recruiter. Give the following:

1. A 3-bullet executive summary of the resume match
2. A detailed, bullet-pointed resume feedback
3. Suggestions to better match this:

Job Title: "${jobTitle}"
Job Description: ${jobDesc || "N/A"}
Resume Content:
${resumeText}

Return results in Markdown format.
`;


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const feedback = response.text;

    // ⚡ Bolt: Save to cache and evict oldest if necessary
    analyzeCache.set(cacheKey, feedback);
    if (analyzeCache.size > CACHE_MAX_SIZE) {
      const oldestKey = analyzeCache.keys().next().value;
      analyzeCache.delete(oldestKey);
    }

    res.json({ feedback });
  } catch (error) {
    console.error("🔥 Gemini Error:", error.message);
    res.status(500).json({ error: "AI processing failed." });
  }
});

app.get("/api/test", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: "Say hi!" }] }],
    });

    res.send(response.text);
  } catch (e) {
    console.error("🔥 Gemini Test Error:", e.message);
    res.status(500).send("Test failed: " + e.message);
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
