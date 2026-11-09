# Contributing to HireSense

## Before you start

1. **Read `ARCHITECTURE.md`.** It explains what HireSense does, how the code fits
   together, and the gotchas (hardcoded API URL, no tests yet, no licence yet).
2. **Pick one open issue from the [issue tracker](https://github.com/khizzcr7/HireSense/issues).** One issue = one pull request. Do not bundle unrelated changes into a single PR. Issues labelled `good first issue` are the best place to start.
3. **Check the issue is free.** Comment on the issue (or ask the maintainer) before
   starting, so two people do not build the same thing.
4. **You need a Gemini API key** for end-to-end testing of the server
   (`GEMINI_API_KEY` in `hiresense-server/.env`). You can run the validation paths
   and the test suites without one — see "Testing" below. Never commit a real key.

## Setup

```bash
git clone https://github.com/khizzcr7/HireSense.git
cd HireSense

# Server
cd hiresense-server
npm install
# create .env with: GEMINI_API_KEY=your-key-here
node index.js          # http://localhost:5000

# Client (second terminal)
cd ../hiresense-client
npm install            # or `npm ci`
npm run dev            # http://localhost:5173
```

- Node 18+ is required (developed and verified on Node 24).
- The client talks to `http://localhost:5000` by default. If issue 9 has landed, set
  `VITE_API_URL` in `hiresense-client/.env` to point elsewhere.

## Branch and PR process

1. Fork the repo, then branch off `main`:
   `git checkout -b <type>/<short-name>` — e.g. `fix/upload-validation`,
   `feat/export-pdf`, `test/server-suite`.
2. Keep the PR to one issue. If you spot something else while working, file it as a
   separate issue instead of fixing it in passing.
3. Commit messages: short, imperative, and specific — e.g.
   `Reject non-PDF uploads with 400` rather than `fix stuff`.
4. Push to your fork and open a PR against `main` with:
   - The issue number it closes ("Closes #N").
   - What you changed and why, in a few sentences.
   - How you tested it (commands run + results, or test output).
   - Anything you deliberately did not do.
5. Do not force-push after review has started. Address feedback with new commits.
6. The maintainer (Khizar) reviews every PR. Expect review comments; responding to
   them is part of the contribution. A PR is merged when the code is correct, the
   tests pass, and the acceptance criteria in the issue are met.

## Code style

- Match the existing style: 2-space indent, double quotes, semicolons, one clear
  idea per function.
- JavaScript only — the codebase is `.js`/`.jsx`, no TypeScript.
- Client: React function components and hooks (the app is a single `App.jsx` today;
  do not split it into files unless your issue genuinely needs it).
- Server: plain Express in `index.js` for now. If your issue adds a module (e.g.
  `config.js`), keep it small and require it from `index.js` — do not restructure
  the whole server in one PR.
- `npm run lint` must pass with zero errors before you open a PR. Fix lint errors
  your change introduces; if you touch a file with a pre-existing lint error, fix
  that too and say so in the PR description.

## Testing

- **New behaviour ships with tests.** A bug fix includes a test that fails before
  the fix and passes after. A feature includes tests for its happy path and its
  main error paths.
- **Server:** Vitest (or Jest) + Supertest, with `@google/genai` mocked — no test
  may call the real Gemini API or need a key. (Test harness lands with issue 7;
  until then, add focused supertest cases alongside your change and note it.)
- **Client:** Vitest + React Testing Library, with Axios mocked — no test may hit a
  real server. (Harness lands with issue 14; same note applies.)
- Run the full suite before opening a PR: `npm test` in the package you changed.
- If a test cannot run without a real API key, it does not belong in the suite —
  use mocks. Manual end-to-end checks (real key, real PDF) are welcome as extra
  verification; say what you ran in the PR description.

## Review expectations

- **For contributors:** you wrote the code, so you own explaining it. Reply to
  review comments; if you disagree, say why and propose an alternative. Keep the
  PR focused — review is fast when the diff is small.
- **For the maintainer:** review within a few days, be specific about what needs to
  change and why, and merge promptly once the acceptance criteria are met. Do not
  let good PRs rot — stale PRs are how contributors disappear.
- **Tests are part of review.** A PR with no tests for new behaviour will be asked
  for tests before merging.

## What not to do

- Do not commit `node_modules/`, `uploads/`, `.env`, or `dist/`. They are (or will
  be) gitignored.
- Do not commit secrets, API keys, or real resumes/PDFs.
- Do not add a new dependency without saying why in the PR — and prefer the one
  already installed if it does the job (e.g. `html2pdf.js` is already there for PDF
  export).
- Do not reformat whole files, rename things for fun, or "clean up" unrelated code
  in your PR. Reviewers need to see your change, not your taste.
- Do not submit work you do not understand. If someone helped you (including an AI
  assistant), you still need to be able to explain every line you submit, and you
  submit it under your own account.
- Do not open PRs for issues already claimed or closed, and do not open duplicate
  PRs for the same issue.

## Questions

Open a GitHub issue with the `question` label, or ask the maintainer directly.
If the answer changes how the project works, it belongs in `ARCHITECTURE.md` — say
so and the docs get updated with your PR.
