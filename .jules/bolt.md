## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2023-11-11 - LRU Cache for API Analysis
**Learning:** The backend `/api/analyze` endpoint performs redundant external AI calls via the Gemini API when processing identical requests, leading to unnecessary latency and performance bottlenecks.
**Action:** Implemented an in-memory LRU cache using a native JavaScript `Map` (bound to a maximum size of 100). Hashing request payloads (resume buffer, job title, and description) ensures distinct entries, bypassing redundant external AI calls.
