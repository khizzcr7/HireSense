## 2023-10-27 - In-Memory File Uploads for Immediate Processing
**Learning:** Writing files to disk during an API request solely to immediately read them back for processing and then delete them introduces unnecessary disk I/O latency and failure points.
**Action:** Use `multer.memoryStorage()` for small, ephemeral file uploads (like resumes) to keep them in memory (`req.file.buffer`) for the lifecycle of the request, improving API response time and reducing disk operations.
## 2024-05-18 - Heavy Markdown Parsing Blocks Initial Load
**Learning:** `react-markdown` and its dependencies represent a significant chunk of the bundle size, but it's only required when the user submits their resume and views feedback. Including it in the main bundle delays initial application startup.
**Action:** Always lazy load heavy components/libraries that aren't visible on the initial render path (e.g., feedback renderers, modals, secondary routes) using `React.lazy()` and `Suspense` to improve initial load performance.
