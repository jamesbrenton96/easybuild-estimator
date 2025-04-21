
import React from "react";

/**
 * All table/markdown-specific styling to apply to estimate markdown output.
 * Designed to be imported and included inside MarkdownEstimate.
 */
export default function MarkdownTableStyle() {
  return (
    <style>{`
      .markdown-content {
        font-family: Arial, Helvetica, "Segoe UI", sans-serif !important;
      }
      .markdown-content table {
        border-collapse: collapse;
        margin: 2rem auto 2.5rem auto;
        width: 100%;
        background: #fff;
        font-size: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        border-radius: 8px;
        overflow: hidden;
      }
      .markdown-content th, .markdown-content td {
        border: 1px solid #f1f5f9;
        padding: 1em 1.1em;
        text-align: right;
      }
      .markdown-content th:first-child, .markdown-content td:first-child {
        text-align: left;
      }
      .markdown-content th {
        background: #f97316;
        font-weight: 700;
        color: white;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .markdown-content tr {
        background: #fff;
        transition: background 0.15s;
      }
      .markdown-content tr:nth-child(even) {
        background: #f9fafb;
      }
      .markdown-content tr:last-child td {
        font-weight: 700;
      }
      .markdown-content tr.subtotal-row td, 
      .markdown-content tr.total-row td {
        border-top: 2.5px solid #f97316 !important;
        font-weight: 700;
      }
      .markdown-content .summary-block {
        background: #fff8f3;
        border-left: 4px solid #f97316;
        border-radius: 5px;
        padding: 1.25rem 1.5rem;
        margin: 1.75rem 0;
      }
      .markdown-content h1, .markdown-content .estimate-title {
        color: #f97316 !important;
        font-size: 2.1rem !important;
        font-weight: 900;
        margin-bottom: 0.5rem !important;
        margin-top: 0.5rem !important;
      }
      .markdown-content h2 {
        color: #f97316 !important;
        font-size: 1.45rem !important;
        font-weight: 700;
        margin-top: 1.75rem !important;
        margin-bottom: 1rem !important;
        letter-spacing: -0.02em;
      }
      .markdown-content h3 { 
        color: #e58c33 !important;
        font-size: 1.1rem !important;
        font-weight: 600;
        margin-top: 1.15rem !important;
        margin-bottom: 0.75rem !important;
      }
      .markdown-content h4 { 
        color: #475569 !important;
        font-size: 1.05rem !important;
        font-weight: 600;
        margin-top: 1.1rem !important;
        margin-bottom: 0.5rem !important;
      }
      /* Custom bullet points */
      .markdown-content ul, .markdown-content ol {
        margin-top: 0.5rem;
        margin-bottom: 1.2rem;
        padding-left: 2.2rem;
      }
      .markdown-content li {
        margin-bottom: 0.5rem;
        line-height: 1.8;
        position: relative;
        font-size: 1rem;
        color: #283042;
      }
      .markdown-content ul li::marker {
        color: #f97316;
        font-size: 1.45em;
      }
      .markdown-content p {
        color: #344051;
        margin-top: 0.6rem;
        margin-bottom: 1.1rem;
        line-height: 1.7;
        font-size: 1rem;
      }
      .markdown-content strong, .markdown-content b {
        color: #f97316;
        font-weight: 700;
      }
      .markdown-content .total-project-cost-block {
        font-size: 1.5rem;
        font-weight: 900;
        color: #fff;
        background: linear-gradient(90deg, #f97316 0%, #e58c33 100%);
        padding: 1.25rem 2.25rem;
        border-radius: 6px;
        margin: 2.5rem 0 1.75rem 0;
        display: inline-block;
        border-left: 7px solid #fff;
        box-shadow: 0 4px 18px -4px #e58c3333;
        text-shadow: 0 1px 4px #e58c3330;
        letter-spacing: 0.01em;
      }
      .markdown-content .section-number {
        display: inline-block;
        background: #f97316;
        color: white;
        width: 28px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-radius: 50%;
        margin-right: 0.6rem;
        font-weight: 900;
        font-size: 1.1em;
        letter-spacing: 0.01em;
        box-shadow: 0 1px 2px #e58c3366;
      }
      /* Orange divider */
      .markdown-content .orange-divider {
        border: none;
        height: 3px;
        width: 100%;
        background: #f97316;
        margin: 2.5rem 0 2rem;
      }
      @media print {
        .markdown-content {
          font-size: 12pt !important;
          background: #fff;
        }
        .markdown-content .total-project-cost-block {
          font-size: 1.28rem !important;
        }
        .markdown-content table {
          page-break-inside: avoid;
        }
      }
    `}</style>
  );
}
