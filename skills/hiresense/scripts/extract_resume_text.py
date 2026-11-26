#!/usr/bin/env python3
"""Extract plain text from a PDF resume.

Part of the HireSense skill (https://github.com/khizzcr7/HireSense).
Reads a PDF file and prints its text to stdout, so the agent can match the
resume against a job posting. No network calls, no credentials, no writes.

Usage:
    python3 extract_resume_text.py <resume.pdf> [--max-chars N]

Options:
    --max-chars N   Truncate output to N characters (default: 20000).
                    A "[... truncated ...]" marker is appended when cut.

Exit codes:
    0  success
    2  file missing, unreadable, or not a PDF
    3  no text found (often a scanned/image-only PDF) or encrypted PDF
    4  pypdf is not installed

Install the one dependency with:
    pip install pypdf
(On systems with an externally-managed Python, use
    pip install --user pypdf
 or a virtualenv.)
"""

import argparse
import sys

DEFAULT_MAX_CHARS = 20000


def fail(message, code):
    print(f"extract_resume_text: error: {message}", file=sys.stderr)
    return code


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Extract plain text from a PDF resume."
    )
    parser.add_argument("pdf", help="Path to the resume PDF file.")
    parser.add_argument(
        "--max-chars",
        type=int,
        default=DEFAULT_MAX_CHARS,
        help=f"Maximum characters to print (default: {DEFAULT_MAX_CHARS}).",
    )
    args = parser.parse_args(argv)

    try:
        from pypdf import PdfReader
    except ImportError:
        print(
            "extract_resume_text: error: the 'pypdf' package is not installed.\n"
            "Install it with: pip install pypdf",
            file=sys.stderr,
        )
        return 4

    try:
        reader = PdfReader(args.pdf)
    except FileNotFoundError:
        return fail(f"file not found: {args.pdf}", 2)
    except Exception as exc:  # unreadable or not a PDF
        return fail(f"could not read {args.pdf} as a PDF ({exc})", 2)

    if reader.is_encrypted:
        try:
            reader.decrypt("")
        except Exception:
            return fail(
                f"{args.pdf} is encrypted and could not be opened.", 3
            )

    pages = []
    for page in reader.pages:
        try:
            pages.append(page.extract_text() or "")
        except Exception:
            pages.append("")
    text = "\n".join(pages).strip()

    if not text:
        return fail(
            f"no text found in {args.pdf}. It may be a scanned or "
            "image-only PDF, which this script cannot read. "
            "Ask the user for a text-based PDF or pasted resume text.",
            3,
        )

    truncated = False
    if len(text) > args.max_chars:
        text = text[: args.max_chars]
        truncated = True

    sys.stdout.write(text)
    if truncated:
        sys.stdout.write(
            f"\n\n[... truncated to {args.max_chars} characters ...]"
        )
    sys.stdout.write("\n")

    print(
        f"extract_resume_text: {len(reader.pages)} page(s), "
        f"{len(text)} character(s) extracted.",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
