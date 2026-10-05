## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.
## 2024-10-05 - Lazy Loading Frontend Components
**Learning:** Initial application load can be slow due to large JS bundles downloading unused components. ReactMarkdown is a heavy component but it is only rendered after fetching feedback.
**Action:** Always identify components only needed after user interactions or async processes and code-split them using React.lazy and Suspense to reduce initial bundle sizes.
