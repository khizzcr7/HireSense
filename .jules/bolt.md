## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.
## 2024-05-24 - Hooks Placement
**Learning:** Calling hooks inline inside the JSX tree is an anti-pattern that violates the Rules of Hooks and causes failure. The inline conditional logic means the hook is vulnerable to conditional rendering.
**Action:** Always define `useMemo` (and all other hooks) at the top level of the component scope, and render the memoized value into the JSX.
