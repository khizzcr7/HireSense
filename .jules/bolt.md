## 2023-10-01 - Lazy Loading React-Markdown
**Learning:** The initial Vite bundle of the `hiresense-client` app was large (~344kB) due to eagerly loading `react-markdown`, which is only needed after user interaction (when feedback is returned).
**Action:** Always check if heavy third-party React libraries (like `react-markdown` or rich-text editors) that are not needed on initial render can be dynamically imported using `React.lazy()` and `Suspense` to split the bundle and improve initial load times.
