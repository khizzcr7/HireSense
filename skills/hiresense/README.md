# HireSense skill

Match a resume against a job posting and get tailored feedback — the
HireSense web app (https://github.com/khizzcr7/HireSense, MIT), repackaged
as an agent skill.

## What it does

1. Reads the user's resume from a PDF (`scripts/extract_resume_text.py`).
2. Takes a job title and an optional job description — or fetches a live
   listing from Indeed / Google Jobs via Agensi tools when no description
   is pasted.
3. Analyses the match with the agent's own model, using the exact
   HireSense prompt (`reference/matching-prompt.md`), and returns
   Markdown: a 3-bullet executive summary, detailed bullet-point feedback,
   and concrete suggestions.

## Files

- `SKILL.md` — the skill instructions (name, description, steps, tools).
- `scripts/extract_resume_text.py` — extracts text from a PDF resume.
  Python 3.9+, one dependency: `pip install pypdf`. No network calls.
- `reference/matching-prompt.md` — the verbatim HireSense prompt and the
  output contract.
- `reference/example-output.md` — a fictional worked example.

## Needs

- Python 3.9+ with `pypdf` (only for PDF resumes; pasted resume text
  needs nothing).
- Agensi jobs tools (selected at upload): "Indeed job search results",
  "Litescrape Search Indeed Jobs", "Litescrape Search Google Jobs",
  "AnyAPI Indeed Jobs". The buyer pays tool calls from their Agensi
  balance, separately from the skill price. No API keys anywhere.

## Limits

- English only. No numeric match score (the app has none either).
- Scanned / image-only PDFs cannot be read (no OCR).
- Does not apply to jobs or write cover letters.
