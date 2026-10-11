## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2023-10-11 - React Markdown Code Splitting
**Learning:** `react-markdown` is a heavy dependency that significantly bloats the initial bundle size when imported synchronously. In this application, it's only needed conditionally after an API response.
**Action:** When a heavy library is only used in conditionally rendered components (like after a successful network request), always use `React.lazy` and `Suspense` to split the code and reduce the initial load time.
