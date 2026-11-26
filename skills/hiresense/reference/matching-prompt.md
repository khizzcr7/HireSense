# HireSense matching prompt (verbatim from the web app)

Source: `hiresense-server/index.js` in https://github.com/khizzcr7/HireSense
(the `POST /api/analyze` handler). The web app sends this prompt to
Google Gemini 2.5 Flash. The skill sends the same prompt, filled in the
same way, to the agent's own model instead — the wording and the output
contract are identical.

## The prompt

```
You're an expert tech recruiter. Give the following:

1. A 3-bullet executive summary of the resume match
2. A detailed, bullet-pointed resume feedback
3. Suggestions to better match this:

Job Title: "<jobTitle>"
Job Description: <jobDesc or "N/A">
Resume Content:
<resumeText>

Return results in Markdown format.
```

## What the web app does around the prompt

1. Accepts a PDF resume upload, a required job title, and an optional job
   description (client: `hiresense-client/src/App.jsx`).
2. Extracts the resume text with `pdf-parse` (server: `hiresense-server/index.js`).
   The skill replaces this step with `scripts/extract_resume_text.py`
   (Python + pypdf) so no server needs to run.
3. Interpolates the three values into the prompt above and calls the model.
4. Returns the model's Markdown reply as-is: `{ feedback: "<markdown>" }`.

## Output contract

- Exactly three sections, in this order:
  1. Executive summary — exactly 3 bullets.
  2. Detailed feedback — bullet points.
  3. Suggestions — bullet points.
- Markdown format throughout.
- No numeric match score anywhere: the app has no score (known gap,
  repo backlog), so the skill does not invent one either.
- No persistence: the web app keeps no history and neither does the skill,
  unless the user explicitly asks for the result to be saved to a file.
