import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

export default function App() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobTitle)
      return alert("Please upload resume and enter job title");
    setLoading(true);
    setCopied(false);
    setCopyError("");
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", jobTitle);
    formData.append("jobDesc", jobDesc);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/analyze",
        formData
      );
      setFeedback(data.feedback);
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFeedback = async () => {
    if (!feedback) return;
    setCopyError("");
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(feedback);
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyError("Failed to copy feedback to clipboard. Please copy it manually.");
    }
  };

  return (
<div className=" main d-flex align-items-center justify-content-center gradient-bg px-3 py-5">
      <form
        onSubmit={handleSubmit}
        className="glass-card fade-in w-100"
        style={{ maxWidth: "640px" }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-stars text-primary display-4 shimmer" />
          <h1 className="text-dark fw-bold mt-2">HireSense</h1>
          <p className="text-muted lead mb-0">
            🎯 Upload your resume and get AI-powered feedback tailored to your role.
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Job Title <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="e.g. MERN Stack Developer"
            required
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Job Description (Optional)</label>
          <textarea
            className="form-control form-control-lg"
            rows="4"
            placeholder="Paste full job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Resume File (PDF only)</label>
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-light">
              <i className="bi bi-paperclip"></i>
            </span>
            <input
              type="file"
              className="form-control"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>
          {resume && (
            <div className="small text-muted mt-1">
              <i className="bi bi-check-circle text-success me-1"></i> {resume.name}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100 glow-on-hover"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Analyzing...
            </>
          ) : (
            "Get AI Suggestions"
          )}
        </button>

        {feedback && (
          <div className="mt-5 p-4 feedback-card react-markdown">
            <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
              <h5 className="text-success fw-bold mb-0">
                💡 Smart Resume Feedback
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={handleCopyFeedback}
                disabled={!feedback}
              >
                <i className={`bi ${copied ? "bi-check2" : "bi-clipboard"} me-1`} />
                {copied ? "Copied!" : "Copy feedback"}
              </button>
            </div>
            {copyError && (
              <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                {copyError}
              </div>
            )}
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        )}
      </form>
    </div>
  );
}
