# HireSense

AI recruitment helper: upload a resume (PDF), enter a job title and an optional job description, and get AI-generated feedback on how well the resume matches the role.

## What it does

- Upload a resume as a PDF
- Enter a job title (required) and a job description (optional)
- Get back an executive summary, detailed feedback, and suggestions from Google Gemini 2.5 Flash

There is no login, no database, and no history. One form, one analysis, one result.

## Stack

- **Client:** React 19 + Vite 7, Axios, react-markdown, Bootstrap 5 + custom CSS
- **Server:** Node + Express 5, Multer, pdf-parse, Google Gemini (`@google/genai`)
- **AI:** Google Gemini 2.5 Flash

## Run it locally

You need Node 18+ and a Google Gemini API key.

```bash
# Server (terminal 1)
cd hiresense-server
npm install
# create .env with: GEMINI_API_KEY=your-key-here
node index.js          # http://localhost:5000

# Client (terminal 2)
cd hiresense-client
npm install
npm run dev            # http://localhost:5173
```

`npm run build` builds the client for production. The server will not start without `GEMINI_API_KEY` set.

## Project structure

```
HireSense/
├── hiresense-client/     React frontend (port 5173)
│   └── src/App.jsx       The entire UI — one component
├── hiresense-server/     Express backend (port 5000)
│   └── index.js          The entire backend — two endpoints
│       ├── POST /api/analyze   Resume + job → AI feedback
│       └── GET  /api/test      Manual Gemini smoke test
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for a full walkthrough of how the app works.

## Contributing

Contributions are welcome. Good first issues are labelled [`good first issue`](https://github.com/khizzcr7/HireSense/labels/good%20first%20issue) — each one is a real, self-contained task with a spec and acceptance criteria.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request: one issue per PR, new behaviour ships with tests, and every contributor works under their own account and understands their changes.

## License

MIT — see [LICENSE](LICENSE).
