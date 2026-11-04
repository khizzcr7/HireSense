## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.
## 2024-05-24 - LRU Cache for AI Resume Analysis
**Learning:** External AI calls are a major bottleneck. Caching identical requests (resume buffer + job details) using an in-memory `Map` as an LRU cache significantly reduces redundant processing. Utilizing a cryptographic hash of the input buffer and metadata provides a reliable cache key.
**Action:** Always consider in-memory caching with a size limit for endpoints that perform expensive or latency-bound operations on deterministic inputs.
