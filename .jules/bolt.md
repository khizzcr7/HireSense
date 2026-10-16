## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.
## 2024-05-24 - Efficient Buffer Hashing for AI Payload Caching
**Learning:** Raw file buffers can be efficiently hashed directly (using Node's `crypto` module) to create stable cache keys. Combining this buffer hash with related metadata (like job title and description separated by delimiters) prevents key collisions and avoids redundant expensive parsing steps (`pdf-parse`) and external AI API latency.
**Action:** Always consider hashing raw buffers or request payloads for caching computationally heavy routes, keeping in mind to separate distinct string components with delimiters to maintain key uniqueness.
