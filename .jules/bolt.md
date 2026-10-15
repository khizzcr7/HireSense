## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2023-10-27 - LRU Caching for LLM API Responses
**Learning:** Calling the Gemini API for identical combinations of resume, job title, and description creates significant performance bottlenecks and redundant costs.
**Action:** Implement an in-memory LRU cache using a native JavaScript `Map` to cache AI responses based on a SHA-256 hash of the request inputs (file buffer, job title, job description), returning cached results for subsequent identical requests.
