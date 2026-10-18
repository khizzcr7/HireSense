## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2026-10-18 - In-Memory LRU Cache for AI Analysis Endpoints
**Learning:** Frequent AI generation and PDF parsing of identical input payloads introduce redundant and costly processing delays.
**Action:** Implemented a lightweight, native JavaScript Map-based LRU Cache bounded by a max size, and hashed the file buffer and query parameters using Node's `crypto` module to safely bypass repetitive parsing and external AI calls.
