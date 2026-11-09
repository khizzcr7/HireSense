# HireSense — Architecture

> Written for a capable friend developer who has never seen this codebase.
> Scope: the repo as cloned 10 Nov 2026 (`main`, last commit 25 Sep 2026, merge of PR #2).
> Everything below was verified against the actual code, the build, and the running server.

## What HireSense is

HireSense is a small AI recruitment helper. A user uploads a resume (PDF), types a job
title and optionally pastes a job description, and gets back AI-generated feedback on how
well the resume matches the role: an executive summary, detailed feedback, and suggestions.
That is the whole product. There is no login, no database, no history — one form, one
analysis, one result.

The pitch ("candidate-job match + rating") is only half built: the AI returns a single
Markdown blob of prose. There is **no numeric match score anywhere** in the code, even
though the concept promises one. That is the biggest product gap (see backlog issue 4).

## Repo map

```
HireSense/
├── hiresense-client/     React 19 + Vite 7 frontend (port 5173)
│   ├── src/
│   │   ├── App.jsx       The entire UI — one 124-line component
│   │   ├── main.jsx      React entry (StrictMode)
│   │   ├── App.css       Custom styles (glass card, gradient, animations)
│   │   └── index.css     Vite boilerplate CSS (Tailwind directives COMMENTED OUT)
│   ├── index.html
│   ├── vite.config.js    Dev server on :5173
│   ├── tailwind.config.js  DEAD — Tailwind is not wired up (see Gotchas)
│   └── package.json      No test script, no test runner
└── hiresense-server/     Node + Express 5 backend (port 5000)
    ├── index.js          The entire backend — one 83-line file, 2 endpoints
    ├── package.json      No test script (the default `test` exits 1 by design)
    ├── node_modules/     COMMITTED to git — should not be there (see Gotchas)
    └── uploads/          Two copies of Khizar's own CV PDF, committed — should not be there
```

The repo has a root README and an MIT LICENSE file. The client README is the untouched Vite boilerplate. `package.json` in the server says `"license": "ISC"`, but the repo licence is MIT — see `LICENSE`.

## Stack

| Layer | Tech | Notes |
|---|---|---|
| Frontend | React 19, Vite 7, Axios | Single-page, no routing, no state library |
| Styling | Bootstrap 5 + react-bootstrap (installed, unused) + custom CSS | Tailwind 4 installed but **not active** |
| Markdown | react-markdown 10 | Renders the AI's Markdown reply |
| PDF export | html2pdf.js 0.10 | Installed but **never imported** — a feature waiting to happen |
| Backend | Node 24, Express 5, Multer, pdf-parse | Single file, no router/modules |
| AI | Google Gemini 2.5 Flash via `@google/genai` | Key from `GEMINI_API_KEY` in server `.env` |
| Tests | None anywhere | No runner, no test files, server `npm test` fails by design |
| Lint | ESLint 9 (client only) | Currently **2 errors** (see Gotchas) |

## How it works end-to-end

1. **User fills the form** (`hiresense-client/src/App.jsx`).
   Job Title is required, Job Description optional, resume must be a PDF
   (`accept=".pdf"` — client-side only, the server does not check).
2. **Submit** builds a `FormData` (`resume`, `jobTitle`, `jobDesc`) and POSTs it with
   Axios to `http://localhost:5000/api/analyze` — the URL is **hardcoded** (App.jsx:29).
3. **Server receives the upload** (`hiresense-server/index.js`, `POST /api/analyze`).
   Multer uses `memoryStorage()`, so the file lives only in `req.file.buffer` — this was
   PR #2, the one merged improvement. There is **no file-size limit and no file-type
   check** on the server.
4. **PDF text extraction**: `pdf-parse` reads `req.file.buffer` into plain text.
   A non-PDF file reaches this step and throws ("Invalid PDF structure") — verified
   live: the user gets a generic 500.
5. **Prompt building**: the resume text, job title and job description are interpolated
   into a prompt asking Gemini for (a) a 3-bullet executive summary, (b) detailed
   bullet-point feedback, (c) suggestions — returned as Markdown.
6. **Gemini call**: `ai.models.generateContent({ model: "gemini-2.5-flash", ... })`.
   The API key comes from `GEMINI_API_KEY` in `hiresense-server/.env` (loaded by
   `dotenv`). There is no check at startup that the key exists.
7. **Response**: `{ feedback: "<markdown string>" }`. The client renders it with
   `<ReactMarkdown>` inside a feedback card. There is no score, no sections as data,
   no persistence — refresh and the result is gone.
8. **Second endpoint**: `GET /api/test` sends "Say hi!" to Gemini and returns the reply.
   It is a manual smoke test, not a health check (it costs a real Gemini call).

## Key files

| File | What it does | Worth knowing |
|---|---|---|
| `hiresense-server/index.js` (83 lines) | All backend logic | Two routes, one prompt, generic 500s. Read this file first — it is the whole backend. |
| `hiresense-client/src/App.jsx` (124 lines) | All UI logic | One component: form state, submit, feedback display. |
| `hiresense-client/src/App.css` | All custom styling | `.glass-card`, `.gradient-bg`, `.fade-in`, `.shimmer`, `.glow-on-hover`, `.feedback-card`. |
| `hiresense-client/src/main.jsx` | Entry | `StrictMode` + `index.css` + `App`. |
| `hiresense-client/vite.config.js` | Dev server | Port 5173, React plugin. No proxy — the client calls the server by absolute localhost URL. |
| `.jules/bolt.md` | Agent notes | One learning note about the memoryStorage change (PR #2). |

## How to run it locally

Prerequisites: Node 18+ (tested on Node 24), npm, a Google Gemini API key.

```bash
# 1. Server
cd hiresense-server
npm install            # node_modules is committed in git, but install anyway to be safe
cp .env.example .env   # NOTE: no .env.example exists yet — create .env with:
# GEMINI_API_KEY=your-key-here
node index.js          # listens on http://localhost:5000

# 2. Client (second terminal)
cd hiresense-client
npm install            # or `npm ci` — a lockfile exists
npm run dev            # http://localhost:5173
npm run build          # production build (verified: builds in ~3s)
npm run lint           # currently 2 errors — see Gotchas
```

Full end-to-end analysis needs a real `GEMINI_API_KEY`. Without it the server still
starts and the validation paths work (missing file → 400), but any Gemini call fails.
The validation paths were smoke-tested live on 10 Nov 2026; the full AI round-trip was
not, because no key was available.

## Gotchas — read before you touch anything

1. **Licence.** The repo is licensed under MIT — see `LICENSE` (added 10 Nov 2026).
2. **Stale bot PRs — closed.** The repo once had 44 open PRs, all by khizzcr7, all titled "⚡ Bolt: …" — an automation that opened duplicate after duplicate (26× "add LRU cache", 14× "lazy-load / code-split react-markdown", 2× memoize, 1 generic). Only PR #2 was ever merged. All 44 were closed on 10 Nov 2026 when the repo was opened to contributors. If new Bolt duplicates appear, ignore them — they are not real work.
3. **Committed `node_modules` + `uploads/`.** `hiresense-server/node_modules/` is in git
   (the server `.gitignore` only ignores `.env`), which is why the repo is 9.7 MB.
   `uploads/` holds two identical copies of Khizar's own CV PDF. Both should be removed
   from git and gitignored. Do not touch this without Khizar's say-so — it rewrites
   tracked files.
4. **Hardcoded API URL.** The client calls `http://localhost:5000` directly. There is
   no `VITE_API_URL` or equivalent. The app cannot talk to a deployed server.
5. **No validation where it matters.** The server trusts the client completely: no file
   size limit, no PDF check, no `jobTitle` check. A 500 MB upload or a `.exe` renamed
   to `.pdf` both hit `pdf-parse` and die with a generic 500.
6. **Dead dependencies and dead config.** `html2pdf.js` and `react-bootstrap` are
   installed but never imported. Tailwind is installed, has a config file, and is
   commented out of `index.css` — the config is also the cause of one of the two lint
   errors (`module is not defined`, because the project is ESM). The other lint error
   is an unused `err` in `App.jsx`'s catch block.
7. **No tests, no error boundaries.** No test runner on either side. Client errors are
   `alert("Something went wrong.")` and the server's error message is swallowed. Stale
   feedback from a previous analysis stays on screen while a new one loads.
8. **Wide-open CORS.** `app.use(cors())` with no origin restriction. Fine for local dev,
   wrong for anything public.
9. **No score, no history.** The product concept promises a match rating; the code has
   none. Results are not saved anywhere.

## Where to start

If you are picking your first issue, the intended order is roughly:

1. **Server validation (#1, #2)** — small, self-contained, instantly verifiable.
2. **API URL from env (#9)** — small, unblocks every deployed scenario.
3. **Health endpoint (#3)** — small, makes the server operable.
4. Then the bigger ones: structured output (#4), export to PDF (#10), test suites
   (#7, #14).

Browse the open issues on GitHub for the full list and `CONTRIBUTING.md` for how to work.
