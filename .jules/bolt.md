## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2024-10-22 - Bounded LRU Cache for Redundant AI Analysis
**Learning:** Redundant AI calls with the exact same resume and job parameters are expensive, time-consuming, and block the main thread with unnecessary `pdf-parse` operations.
**Action:** Implement a bounded In-Memory LRU cache using `Map` with a maximum size (e.g. 100), keying on a hash of the file buffer (using `crypto`) and request parameters, to skip PDF parsing and AI calls for duplicate inputs. Maintain LRU order by deleting and re-inserting on hit, and evict the oldest entry when size exceeds bounds.
