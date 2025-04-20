
import React from "react";

/**
 * All table/markdown-specific styling to apply to estimate markdown output.
 * Designed to be imported and included inside MarkdownEstimate.
 */
export default function MarkdownTableStyle() {
  return (
    <style>{`
      .markdown-content table {
        border-collapse: collapse;
        margin: 1.25rem auto 1.75rem auto;
        width: 100%;
        background: #f7fafc;
        font-size: 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        border-radius: 8px;
      }
      .markdown-content th, .markdown-content td {
        border: 1px solid #e5e7eb;
        padding: 0.55em 0.7em;
        text-align: left;
      }
      .markdown-content th {
        background: #f8fafc;
        font-weight: 700;
        color: #ff8600;
        letter-spacing: 0.01em;
      }
      .markdown-content tr:nth-child(even) td {
        background: #f9fafb;
      }
      .markdown-content tr:last-child td {
        font-weight: 600;
        color: #166534;
      }
      /* Highlight summary/total rows in subtle box */
      .markdown-content tr td strong, .markdown-content tr td b {
        color: #134e23;
        font-size: 1.08em;
      }
      .markdown-content .summary-block {
        background: #f9f6f0;
        border: 2px solid #ffe0b2;
        border-radius: 8px;
        padding: 1rem;
        margin: 1.5rem 0;
        text-align: center;
      }
      /* Prose tweaks for headings/spacing */
      .markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4 {
        color: #ff8600 !important;
        font-family: inherit;
        font-weight: 700;
        margin-top: 1.65em !important;
        margin-bottom: 0.7em !important;
      }
      .markdown-content h1 {
        border-bottom: 1.5px solid #ffe2bd;
        padding-bottom: 0.4em;
        font-size: 2.1em !important;
      }
      .markdown-content h2 { font-size: 1.34em !important; }
      .markdown-content h3 { font-size: 1.07em !important; }
      .markdown-content h4 { font-size: 0.98em !important; }
      .markdown-content ul, .markdown-content ol {
        margin-top: 0.3em;
        margin-bottom: 0.7em;
        margin-left: 1.45em;
      }
      .markdown-content li {
        margin-bottom: 0.17em;
        line-height: 1.7;
      }
      .markdown-content p {
        color: #313131;
        margin-top: 0.15em;
        margin-bottom: 0.85em;
        line-height: 1.7;
      }
      .markdown-content strong, .markdown-content b {
        color: #ff8600;
        font-weight: 600;
      }
      .markdown-content .summary-em {
        font-size: 1.19em;
        font-weight: 700;
        color: #15803d;
        background: #ecfdf5;
        padding: 0.32em 1.12em;
        border-radius: 22px;
        margin: 0.28em 0;
        display: inline-block;
      }
    `}</style>
  );
}
