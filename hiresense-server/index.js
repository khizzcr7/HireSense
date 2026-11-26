const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const config = require("./config");

const app = express();
app.use(cors({ origin: config.allowedOrigins }));
app.use(express.json());

const ai = new GoogleGenAI({}); // Automatically picks GEMINI_API_KEY from .env
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadMb * 1024 * 1024 },
});

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    const { jobTitle, jobDesc } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Resume file missing or not uploaded." });
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
      model: config.geminiModel,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const feedback = response.text;

    res.json({ feedback });
  } catch (error) {
    console.error("🔥 Gemini Error:", error.message);
    res.status(500).json({ error: "AI processing failed." });
  }
});

app.get("/api/test", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: [{ role: "user", parts: [{ text: "Say hi!" }] }],
    });

    res.send(response.text);
  } catch (e) {
    console.error("🔥 Gemini Test Error:", e.message);
    res.status(500).send("Test failed: " + e.message);
  }
});

app.listen(config.port, () => {
  console.log(`✅ Server running on http://localhost:${config.port}`);
});
