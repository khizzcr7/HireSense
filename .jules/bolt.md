## 2026-10-04 - React Markdown Lazy Loading
**Learning:** Large parsing libraries like `react-markdown` significantly increase the initial bundle size, even when only needed conditionally (e.g., after an API response).
**Action:** Use `React.lazy` and `Suspense` to dynamically import heavy parsing libraries only when they are actually rendered, keeping the critical rendering path fast.
