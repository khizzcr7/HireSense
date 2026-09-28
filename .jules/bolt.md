## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2025-02-12 - Code Splitting Heavy Markdown Rendering Libraries
**Learning:** `react-markdown` and its underlying unified/remark ecosystem is exceptionally large (~117kB gzipped). Since it's only rendered conditionally *after* an AI response (which takes time), including it in the main bundle severely harms initial load performance.
**Action:** Always lazy load markdown rendering libraries using `React.lazy` and `Suspense` when they are used for displaying dynamically generated content that doesn't appear on initial render.
