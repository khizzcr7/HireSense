const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const crypto = require("crypto");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

// ⚡ Bolt: Implemented an in-memory LRU cache to avoid redundant external AI calls for the same payload
const MAX_CACHE_SIZE = 100;
const lruCache = new Map();

function generateCacheKey(buffer, jobTitle, jobDesc) {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  hash.update('|');
  hash.update(jobTitle || '');
  hash.update('|');
  hash.update(jobDesc || '');
  return hash.digest('hex');
}

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({}); // Automatically picks GEMINI_API_KEY from .env
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    const { jobTitle, jobDesc } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Resume file missing or not uploaded." });
    }

    console.log("Uploaded resume:", req.file.originalname);

    const cacheKey = generateCacheKey(req.file.buffer, jobTitle, jobDesc);

    if (lruCache.has(cacheKey)) {
      console.log("⚡ Bolt: Cache hit, bypassing AI model for:", req.file.originalname);
      const cachedFeedback = lruCache.get(cacheKey);
      // Maintain LRU order by deleting and re-inserting
      lruCache.delete(cacheKey);
      lruCache.set(cacheKey, cachedFeedback);
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

    // Add to LRU cache, evicting the oldest if at capacity
    if (lruCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = lruCache.keys().next().value;
      lruCache.delete(oldestKey);
    }
    lruCache.set(cacheKey, feedback);

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
