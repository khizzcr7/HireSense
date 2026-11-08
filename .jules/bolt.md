## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.
## 2024-11-08 - LRU Cache for Gemini API
**Learning:** The `/api/analyze` endpoint was making redundant external AI calls to Gemini for the same resume and job description. Hashing the incoming buffer and strings via `crypto` directly is highly performant and creates a deterministic cache key. A native JavaScript `Map` preserves insertion order, serving as a trivial LRU structure.
**Action:** Always implement local caching for expensive 3rd party AI API calls when inputs can be deterministically hashed.
