
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
        margin: 1.5rem auto 1.75rem auto;
        width: 100%;
        background: #ffffff;
        font-size: 0.95rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border-radius: 6px;
        overflow: hidden;
      }
      .markdown-content th, .markdown-content td {
        border: 1px solid #e2e8f0;
        padding: 0.75em 1em;
        text-align: left;
      }
      .markdown-content th {
        background: #f97316;
        font-weight: 600;
        color: white;
        letter-spacing: 0.01em;
        text-transform: uppercase;
        font-size: 0.85rem;
      }
      .markdown-content tr:nth-child(even) td {
        background: #f8fafc;
      }
      .markdown-content tr:last-child td {
        font-weight: 600;
      }
      /* Subtotal and Total rows styling */
      .markdown-content tr:nth-last-child(-n+3) td {
        border-top: 2px solid #f97316;
        font-weight: 600;
      }
      .markdown-content tr td strong, .markdown-content tr td b {
        color: #f97316;
        font-size: 1.05em;
      }
      .markdown-content .summary-block {
        background: #fff8f3;
        border-left: 4px solid #f97316;
        border-radius: 4px;
        padding: 1.25rem;
        margin: 1.5rem 0;
      }
      /* Section headings */
      .markdown-content h1 {
        color: #1e293b !important;
        font-size: 1.75rem !important;
        font-weight: 700;
        margin-top: 2rem !important;
        margin-bottom: 1rem !important;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #f97316;
      }
      .markdown-content h2 {
        color: #f97316 !important;
        font-size: 1.5rem !important;
        font-weight: 600;
        margin-top: 1.75rem !important;
        margin-bottom: 1rem !important;
      }
      .markdown-content h3 { 
        color: #f97316 !important;
        font-size: 1.25rem !important;
        font-weight: 600;
        margin-top: 1.5rem !important;
        margin-bottom: 0.75rem !important;
      }
      .markdown-content h4 { 
        color: #475569 !important;
        font-size: 1.1rem !important;
        font-weight: 600;
        margin-top: 1.25rem !important;
        margin-bottom: 0.5rem !important;
      }
      /* List styles */
      .markdown-content ul, .markdown-content ol {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      }
      .markdown-content li {
        margin-bottom: 0.35rem;
        line-height: 1.6;
      }
      /* Text and paragraphs */
      .markdown-content p {
        color: #334155;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        line-height: 1.6;
      }
      .markdown-content strong, .markdown-content b {
        color: #f97316;
        font-weight: 600;
      }
      /* Project total emphasis */
      .markdown-content .total-project-cost {
        font-size: 1.25rem;
        font-weight: 700;
        color: #f97316;
        background: #fff8f3;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        margin: 1rem 0;
        display: inline-block;
        border-left: 4px solid #f97316;
      }
      /* Section numbering */
      .markdown-content .section-number {
        display: inline-block;
        background: #f97316;
        color: white;
        width: 28px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-radius: 50%;
        margin-right: 0.5rem;
        font-weight: bold;
      }
      /* Estimate header */
      .markdown-content .estimate-header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid #f1f5f9;
      }
      .markdown-content .estimate-title {
        color: #f97316;
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .markdown-content .estimate-subtitle {
        color: #64748b;
        font-size: 1rem;
      }
      /* Print-specific styling */
      @media print {
        .markdown-content {
          font-size: 11pt;
        }
        .markdown-content h1 {
          font-size: 18pt !important;
        }
        .markdown-content h2 {
          font-size: 16pt !important;
        }
        .markdown-content h3 {
          font-size: 14pt !important;
        }
        .markdown-content table {
          page-break-inside: avoid;
        }
        .markdown-content tr {
          page-break-inside: avoid;
        }
      }
    `}</style>
  );
}
