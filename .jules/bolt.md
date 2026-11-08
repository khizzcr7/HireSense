## 2026-11-07 - In-Memory LRU Cache for AI Analysis

**Learning:** Re-analyzing identical resumes with the same job descriptions via the Gemini API generates significant latency and API costs.
**Action:** Implement an in-memory LRU cache using a native JavaScript \`Map\` to cache API responses keyed by a SHA-256 hash of the resume buffer, job title, and job description to prevent redundant external calls and speed up response times.
