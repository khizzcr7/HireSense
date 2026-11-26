require("dotenv").config();

const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = {
  port: parsePositiveInteger(process.env.PORT, 5000),
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  maxUploadMb: parsePositiveInteger(process.env.MAX_UPLOAD_MB, 5),
  rateLimitWindowMs: parsePositiveInteger(
    process.env.RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000
  ),
  rateLimitMax: parsePositiveInteger(process.env.RATE_LIMIT_MAX, 10),
  allowedOrigins,
};
