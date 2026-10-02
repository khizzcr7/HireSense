## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2023-10-27 - Code Splitting Unused Heavy Dependencies
**Learning:** Large libraries like `react-markdown` should not be included in the initial bundle if they are only rendered conditionally after an asynchronous action (e.g., API response). Including them slows down initial application load unnecessarily.
**Action:** Use `React.lazy` and `Suspense` to code-split components that depend on heavy libraries when they aren't needed on first render, improving Time to Interactive (TTI).
