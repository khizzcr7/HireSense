## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2023-11-20 - Lazy Loading Large Components
**Learning:** Initial page loads can be significantly improved by deferring the download and execution of large React components (like `react-markdown` and its dependencies) until they are actually needed (e.g. after a form submission).
**Action:** When a large, complex component is only rendered conditionally (or post-interaction), wrap it with `React.lazy()` and `<Suspense>` to enable automatic code splitting and reduce the initial JS payload.
