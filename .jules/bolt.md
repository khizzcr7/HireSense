
## 2024-05-24 - Server Event Loop Blocked by Disk I/O during File Uploads
**Learning:** Writing uploaded files to disk via multer's `dest` option, then using synchronous file system methods like `fs.existsSync`, `fs.readFileSync`, and `fs.unlinkSync` to process the file, blocks the single-threaded Node.js event loop. This severely limits request throughput and creates a major bottleneck, as all other incoming requests must wait while files are written, read, and deleted sequentially.
**Action:** Always prefer `multer.memoryStorage()` for transient files (like parsing a PDF resume before sending text to an LLM) instead of writing them to disk. Pass `req.file.buffer` directly to the processing library to keep operations in-memory and non-blocking.
