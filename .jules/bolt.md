## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2026-10-17 - In-Memory LRU Cache for Redundant API Calls
**Learning:** Generating the exact same AI feedback for identical resume and job description inputs results in unnecessary API latency, costs, and processing time.
**Action:** Implemented an in-memory LRU cache using a Map with SHA-256 hashes of the file buffer and text inputs as keys. This ensures exact repeat requests return instantly and bypass external API calls.
