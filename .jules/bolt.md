## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.
## 2024-05-17 - React Markdown Lazy Loading
**Learning:** `react-markdown` is a heavy dependency that significantly bloats the initial bundle if statically imported, but it's only needed after a user receives feedback from the API.
**Action:** Always lazy load markdown parsing libraries and similar heavy text-processing tools if they are not needed for the initial UI render.
