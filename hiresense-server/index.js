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

const PDF_MAGIC = Buffer.from("%PDF-");
const NOT_A_PDF_MESSAGE =
  "The uploaded file is not a readable PDF. Please upload your resume as a PDF.";

const isPdf = (buffer) =>
  buffer.subarray(0, PDF_MAGIC.length).equals(PDF_MAGIC);

// Multer reports upload problems through its callback; without this wrapper
// they reach Express's default handler and become a 500 with a stack trace.
const uploadResume = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (!err) return next();
    if (!(err instanceof multer.MulterError)) return next(err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: `Resume file is too large. The maximum size is ${config.maxUploadMb} MB.`,
      });
    }
    return res.status(400).json({
      error: 'Invalid upload. Send a single PDF in the "resume" field.',
    });
  });
};

app.post("/api/analyze", uploadResume, async (req, res) => {
  try {
    const { jobTitle, jobDesc } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Resume file missing or not uploaded." });
    }

    console.log("Uploaded resume:", req.file.originalname);

    // The extension and mimetype are client-supplied, so only the content is trusted.
    if (!isPdf(req.file.buffer)) {
      return res.status(400).json({ error: NOT_A_PDF_MESSAGE });
    }

    // ⚡ Bolt: Use memory buffer instead of disk I/O to avoid latency from writing/reading files
    let parsed;
    try {
      parsed = await pdfParse(req.file.buffer);
    } catch (parseError) {
      console.error("PDF parse error:", parseError.message);
      return res.status(400).json({ error: NOT_A_PDF_MESSAGE });
    }
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

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`✅ Server running on http://localhost:${config.port}`);
  });
}

module.exports = app;
