const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const crypto = require("crypto");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({}); // Automatically picks GEMINI_API_KEY from .env
const upload = multer({ storage: multer.memoryStorage() });

// ⚡ Bolt: In-memory LRU cache to bypass redundant AI calls
const cache = new Map();
const CACHE_LIMIT = 100;

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    const { jobTitle, jobDesc } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Resume file missing or not uploaded." });
    }

    // ⚡ Bolt: Generate a hash of the request payload to use as a cache key
    const hash = crypto.createHash("sha256");
    hash.update(req.file.buffer);
    hash.update(`|${jobTitle}|${jobDesc || ""}`);
    const cacheKey = hash.digest("hex");

    // ⚡ Bolt: Check if the result is already in the cache
    if (cache.has(cacheKey)) {
      console.log(`⚡ Bolt: Cache hit for ${req.file.originalname}`);
      const cachedFeedback = cache.get(cacheKey);
      // Maintain LRU order by deleting and re-inserting
      cache.delete(cacheKey);
      cache.set(cacheKey, cachedFeedback);
      return res.json({ feedback: cachedFeedback });
    }

    console.log("Uploaded resume:", req.file.originalname);

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

    // ⚡ Bolt: Insert the new result into the cache
    if (cache.size >= CACHE_LIMIT) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    cache.set(cacheKey, feedback);

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
