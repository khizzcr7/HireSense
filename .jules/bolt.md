## 2025-02-28 - In-Memory Cache Optimization
**Learning:** For expensive external AI calls, a simple Node native Map cache combined with crypto hashing is effective at drastically reducing response times for duplicate requests without external dependencies like Redis. Bounding cache size (e.g. 100 entries) prevents memory leaks.
**Action:** Always implement a size-bounded, simple in-memory cache for API endpoints invoking expensive third-party network requests.
