## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2024-05-19 - Cache AI Responses using Payload Hashing
**Learning:** Redundant external AI calls with the same payload (resume buffer, job title, job description) result in unnecessary API latency and cost. Relying strictly on in-memory LRU cache helps to optimize repeated analysis requests.
**Action:** Use Node's `crypto` module to hash the request payload for a reliable unique cache key in the `Map`-based LRU cache.
