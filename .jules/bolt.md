## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2024-05-24 - Code Splitting Large React Libraries
**Learning:** Importing large formatting or parsing libraries (like `react-markdown` and its dependencies) at the top level of a component forces the client to download and parse them during the initial page load, even if they aren't needed right away.
**Action:** Use `React.lazy()` and `Suspense` to dynamically import heavy components only when they are about to be rendered. This reduces the initial bundle size and speeds up the time-to-interactive for the main application.
