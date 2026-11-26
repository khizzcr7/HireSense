# Worked example (fictional)

Everything below is invented for illustration only — the person, company
and job are fictional. It shows the exact output shape the skill must
produce.

## Inputs

- **Resume:** Alex Carter, full-stack developer (see
  `test/sample-resume.pdf` in the draft area). 2 years at Northwind Labs
  (React, Node.js, Express, PostgreSQL), 2 years at Brightbyte Studio.
  Skills: JavaScript, React, Node.js, Express, PostgreSQL, Git, REST APIs.
- **Job title:** MERN Stack Developer
- **Job description (pasted):** "We need a MERN Stack Developer with 3+
  years of experience building production web apps. Must have strong
  MongoDB and React, experience with TypeScript, and familiarity with
  AWS deployment. Nice to have: automated testing with Jest."

## Output

```markdown
## Executive summary
- Strong core overlap: 4 years of JavaScript, React, Node and Express work lines up directly with the MERN stack the role asks for.
- Two gaps matter most: no MongoDB anywhere on the resume, and no TypeScript experience shown.
- The resume undersells deployment and testing experience, which the posting lists as required and nice-to-have.

## Detailed feedback
- Work history is relevant and quantified: the 40% report-load-time improvement at Northwind Labs is the strongest single proof point, but it is buried mid-bullet.
- The skills section lists PostgreSQL but not MongoDB. For a MERN role this reads as a SQL-only background unless the resume says otherwise.
- No mention of TypeScript, AWS, or testing frameworks anywhere in the resume, although the posting asks for all three.
- The most recent role (2022 - present) matches the seniority the role wants, but the resume never states years of experience outright.
- Education is listed without dates of relevant coursework or projects; fine for a mid-level role, not a selling point.

## Suggestions
- Add a line under the Northwind Labs role naming the database actually used; if any project used MongoDB, name it and what it stored.
- If you have TypeScript experience from any project, add it to the skills section and to one work bullet; if not, say so and note it as in progress.
- Add one bullet on deployment (even a small AWS or CI/CD mention) and one on testing (Jest or any test runner) to cover the posting's remaining asks.
- Move the 40% load-time result to the top of the Northwind Labs bullets so a recruiter sees it first.
- State total years of experience ("4 years building production web apps") near the top of the resume.
```
