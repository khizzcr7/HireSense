## 2024-05-24 - Frontend Markdown Parsing Strategy
**Learning:** The React application utilizes `react-markdown` to render the AI feedback. Because this feedback is only generated after a user action (form submission and API call), the heavy markdown library is entirely unnecessary for the initial page load.
**Action:** Always lazy load heavy formatting or presentation libraries (like markdown parsers, syntax highlighters) when they are strictly dependent on user-generated asynchronous data fetching, using `React.lazy` and `Suspense`.
