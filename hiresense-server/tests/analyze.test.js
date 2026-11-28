const request = require("supertest");

const mockGenerateContent = jest.fn();

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn(() => ({
    models: { generateContent: mockGenerateContent },
  })),
}));

// Pin the limit so a developer's local .env cannot change what the tests expect.
process.env.MAX_UPLOAD_MB = "5";

const app = require("../index");

const MB = 1024 * 1024;

// Builds a minimal one-page PDF in memory, so no PDF file is committed.
// pdf-parse 1.1.1 misreads buffers small enough for Node to allocate from its
// shared pool (under Buffer.poolSize / 2), so the document is padded with a
// PDF comment to stay above that size.
const buildPdf = (text) => {
  const padding = `%${"x".repeat(Buffer.poolSize)}\n`;
  const stream = `BT /F1 12 Tf 72 720 Td (${text}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = `%PDF-1.4\n${padding}`;
  const offsets = objects.map((object, index) => {
    const offset = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    return offset;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "latin1");
};

const analyze = (file, { field = "resume", filename = "resume.pdf" } = {}) =>
  request(app)
    .post("/api/analyze")
    .field("jobTitle", "React Developer")
    .attach(field, file, { filename, contentType: "application/pdf" });

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  mockGenerateContent.mockReset();
  mockGenerateContent.mockResolvedValue({ text: "## Mock feedback" });
});

describe("POST /api/analyze upload validation", () => {
  test("analyzes a valid PDF under the size limit", async () => {
    const res = await analyze(buildPdf("Jane Doe - React developer"));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ feedback: "## Mock feedback" });
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const prompt = mockGenerateContent.mock.calls[0][0].contents[0].parts[0].text;
    expect(prompt).toContain("Jane Doe - React developer");
  });

  test("rejects a non-PDF file renamed to .pdf with 400", async () => {
    const res = await analyze(Buffer.from("just some plain text"));

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not a readable PDF/i);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("rejects an empty file with 400", async () => {
    const res = await analyze(Buffer.alloc(0));

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not a readable PDF/i);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("rejects a file with a PDF header but a corrupt body with 400", async () => {
    const res = await analyze(Buffer.from("%PDF-1.4\nthis is not a real document"));

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not a readable PDF/i);
    expect(res.body.error).not.toMatch(/Invalid PDF structure/);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("rejects a 6 MB PDF with 400 and names the limit", async () => {
    const oversized = Buffer.concat([
      buildPdf("Jane Doe - React developer"),
      Buffer.alloc(6 * MB),
    ]);

    const res = await analyze(oversized);

    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body.error).toMatch(/too large/i);
    expect(res.body.error).toContain("5 MB");
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("rejects a file sent under the wrong field name with 400", async () => {
    const res = await analyze(buildPdf("Jane Doe"), { field: "cv" });

    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body.error).toMatch(/"resume" field/);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("still returns 400 when no file is uploaded", async () => {
    const res = await request(app)
      .post("/api/analyze")
      .field("jobTitle", "React Developer");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Resume file missing or not uploaded.");
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });
});
