## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2023-11-03 - Cache AI API Responses using Buffer Hashing
**Learning:** External AI calls are slow and expensive, creating a significant bottleneck when users submit identical payloads (e.g., repeatedly analyzing the same resume). Request payloads for file uploads cannot be easily hashed directly without memory or processing overhead, unless we hash the memory buffer itself.
**Action:** Implemented an in-memory LRU cache using a native `Map`. Used `crypto` to efficiently hash `req.file.buffer` along with text fields (separated by delimiters) to create a unique and secure cache key, bypassing redundant external AI calls and drastically reducing API latency.
