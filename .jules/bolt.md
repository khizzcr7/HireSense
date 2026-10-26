## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2026-10-25 - In-Memory API Result Caching
**Learning:** External AI API calls introduce significant latency, and identical requests (same resume and job details) are frequently submitted during testing or repeated actions.
**Action:** Use an in-memory LRU cache based on JavaScript Map and crypto hashing of the file buffer + text fields to bypass redundant API calls safely without introducing external dependencies.
