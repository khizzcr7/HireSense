## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.
## 2026-10-08 - Code Split Large UI Libraries
**Learning:** Large rendering libraries (like react-markdown) are included in the initial bundle by default, slowing down the initial page load even if they are only needed after a complex user interaction (like submitting a form and waiting for an AI response).
**Action:** Use React.lazy() and Suspense to dynamically import such libraries only when they are about to be rendered, significantly reducing the initial bundle size.
