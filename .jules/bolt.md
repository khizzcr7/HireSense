## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2025-02-14 - Caching External AI Calls
**Learning:** Calling external AI services for identical inputs results in unnecessary latency and cost, which is a major performance bottleneck for text generation endpoints.
**Action:** Use an in-memory LRU cache with hashed payloads as keys to safely memoize identical AI requests, significantly speeding up redundant requests while keeping memory bounded.
