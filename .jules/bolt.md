## 2024-05-18 - Avoid Root node_modules Pollution
**Learning:** Running `npm install` and arbitrary scripts in the root directory can unintentionally modify many global state files and pollute `node_modules`.
**Action:** Always install and run test code locally in their respective service directory (e.g. `cd hiresense-server`) to keep changes properly scoped and prevent massive git diff warnings.
