## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.

## 2026-09-27 - ReactMarkdown Re-render Bottleneck
**Learning:** In forms containing both text inputs and a rendered `ReactMarkdown` component, state updates from keystrokes can cause the expensive markdown parser to re-run and re-render entirely, even if the markdown content hasn't changed. This leads to noticeable input lag.
**Action:** Always extract expensive rendering components (like `ReactMarkdown`) into their own child components and wrap them in `React.memo()` when they share parent state with frequently updating controlled inputs.
