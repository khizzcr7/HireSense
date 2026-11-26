---
name: hiresense
description: Match a resume against a job posting and return tailored feedback: a 3-bullet executive summary of the match, detailed bullet-point feedback, and concrete suggestions to close the gaps. Use when the user wants to check how well their resume fits a job title or description, improve a resume for a specific role, or compare their resume against live job listings. Works from a PDF resume; pulls live listings from Indeed and Google Jobs when no job description is pasted.
license: MIT
compatibility: Python 3.9+ with pypdf (pip install pypdf) for resume text extraction. No API keys needed; job data comes from Agensi tools on Agensi's keys.
---

# HireSense — Resume vs Job Match

HireSense is an AI recruitment helper, originally an open-source web app
(https://github.com/khizzcr7/HireSense, MIT license). The user uploads a PDF
resume and gives a job title, and gets back AI feedback on how well the
resume matches the role. This skill does the same job inside the user's
agent: the agent itself does the matching, the resume text comes from the
user's PDF via the bundled script, and live job listings come from Agensi
tools. No server to run, no API keys for the buyer.

## When to use this skill

Use it when the user asks to:

- Check how well their resume fits a job title or a specific job posting
- Get feedback on a resume for a role they want to apply to
- Find out what to change on their resume to match a role better
- Compare their resume against live listings for a role (Indeed, Google Jobs)

Do NOT use it to write a resume from scratch, to apply to jobs on the
user's behalf, or to write a cover letter. This skill only analyses and
advises.

## Inputs

Ask for what is missing. Do not guess.

1. **Resume** — a PDF file path (preferred), or resume text pasted in chat.
2. **Job title** — required (e.g. "MERN Stack Developer").
3. **Job description** — optional. If the user pastes one, use it as-is. If
   they only give a title (and maybe a company or location), fetch a live
   listing first — see "Get the job" below.

## Step 1 — Get the resume text

If the user gave a PDF path, extract the text with the bundled script:

```bash
python3 scripts/extract_resume_text.py <path-to-resume.pdf>
```

- The script prints the resume text to stdout. Use that text, not the file.
- If `pypdf` is missing, the script prints install instructions
  (`pip install pypdf`); run the install, then re-run the script.
- If the script reports no text was found, the PDF is probably scanned or
  image-only. Say so plainly and ask the user for a text-based PDF or
  pasted resume text. Do not invent resume content.
- If the user pasted resume text instead, use it directly and skip the
  script.

## Step 2 — Get the job

- **Job description pasted:** use it exactly as given.
- **Only a title (and maybe company / location):** fetch a real live
  listing with one of the Agensi jobs tools attached to this skill, then
  use that listing's description:
  - "Indeed job search results" — Indeed's US listings; returns title,
    company, location, salary text, job type, posting age.
  - "Litescrape Search Indeed Jobs" — Indeed by keyword and location,
    with salary, experience and remote filters.
  - "Litescrape Search Google Jobs" — Google Jobs listings by query and
    location; best pick for non-US roles.
  - "AnyAPI Indeed Jobs" — fullest Indeed record, including the full
    description and salary range, when the shorter tools do not return
    enough detail.
- If several listings match, pick the closest by title and company, and
  name the listing (title, company, source) at the top of your answer so
  the user knows which posting was matched against. If the user named a
  company, prefer that company's listing.
- Tool calls are paid by the buyer from their Agensi balance, separately
  from this skill's price. Use at most one or two listing lookups per
  analysis; never bulk-fetch listings.

## Step 3 — Analyse the match

Analyse with your own model, following the exact HireSense method. The
web app's prompt is kept in `reference/matching-prompt.md` — use it
verbatim, filling in the job title, job description (or "N/A"), and the
resume text.

Rules for the analysis:

- Base every claim on the resume text and the job text. Never invent
  experience, skills, or qualifications the resume does not show.
- Say explicitly when the resume is missing a skill or requirement the
  job asks for. Do not soften real gaps.
- Keep the output in the same three sections, in the same order, every
  time. Return Markdown.
- Do NOT give a numeric match score. The HireSense app does not score,
  and neither does this skill.
- Keep it practical: the user should finish reading knowing exactly
  what to add, reword, or remove.

### Output format

```markdown
## Executive summary
- <bullet 1>
- <bullet 2>
- <bullet 3>

## Detailed feedback
- <bullet>
- <bullet>
...

## Suggestions
- <bullet>
- <bullet>
...
```

A worked example is in `reference/example-output.md`. If the user asks
for the result as a file, save the Markdown and tell them the path.

## Agensi tools this skill uses

Tool names and starting prices as listed on
https://www.agensi.io/tools/jobs (checked 26 Nov 2026). Prices are
starting prices; the buyer pays per call from their Agensi balance.

| Tool (as named on Agensi) | Used for | Starting price |
| --- | --- | --- |
| Indeed job search results | Live Indeed (US) listings for a title | $0.0002 per call |
| Litescrape Search Indeed Jobs | Indeed by keyword + location, with filters | $0.0002 per call |
| Litescrape Search Google Jobs | Google Jobs listings by query + location | $0.0002 per call |
| AnyAPI Indeed Jobs | Full Indeed record incl. description + salary | $0.0017 per call |

Tool charges are separate from this skill's price. If a tool is missing
or fails, say so and fall back to asking the user to paste the job
description — never silently match against the wrong posting.

## Limits

- English only — the matching prompt and output are in English.
- Scanned or image-only PDFs cannot be read (no OCR in this skill).
- No numeric match score, no auto-apply, no cover letters.
- The skill never sends the user's resume anywhere except to the tools
  above when fetching a job listing (the listing search uses only the
  job title / location, never resume content).
