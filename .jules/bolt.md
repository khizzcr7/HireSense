## 2023-10-24 - Efficient Buffer Hashing in Node
**Learning:** When hashing large file buffers (like PDFs in memory via multer) using Node's crypto module, converting the buffer to a base64 string (`req.file.buffer.toString('base64')`) before hashing allocates unnecessary memory and hurts performance. The crypto `update()` function can take buffers directly.
**Action:** Always pass `Buffer` objects directly to `crypto.createHash().update(buffer)` instead of converting them to strings first to minimize memory allocation and maximize performance.
