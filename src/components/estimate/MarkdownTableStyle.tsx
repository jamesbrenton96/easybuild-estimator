
import React from "react";

/**
 * All table/markdown-specific styling to apply to estimate markdown output.
 * Designed to match the Brenton Building template format.
 */
export default function MarkdownTableStyle() {
  return (
    <style>{`
      .markdown-content {
        font-family: Arial, sans-serif;
      }
      
      /* Project title */
      .project-title {
        font-size: 24px;
        color: #e58c33;
        text-align: center;
        margin: 20px 0 30px 0;
        font-weight: bold;
      }
      
      /* Section headers */
      .section-title {
        color: #e58c33;
        font-weight: bold;
        border-bottom: 1px solid #e58c33;
        padding-bottom: 5px;
        margin-bottom: 15px;
        margin-top: 25px;
        font-size: 16px;
      }
      
      /* Table styles */
      .markdown-content table, .estimate-table {
        border-collapse: collapse;
        margin: 1rem auto 1.5rem auto;
        width: 100%;
        background: #fff;
        font-size: 0.9rem;
        border: 1px solid #ddd;
      }
      
      .markdown-content th, .markdown-content td,
      .estimate-table-header, .estimate-table-cell {
        border: 1px solid #ddd;
        padding: 0.6rem 0.8rem;
        text-align: left;
        vertical-align: top;
        word-break: normal;
      }
      
      .markdown-content th,
      .estimate-table-header {
        background: #f5f5f5;
        font-weight: bold;
        color: #333;
        font-size: 0.9rem;
      }
      
      .markdown-content tr:nth-child(even),
      .estimate-table tr:nth-child(even) {
        background: #fafafa;
      }
      
      /* Total rows */
      .markdown-content tr:last-child td,
      .estimate-table tr:last-child td {
        font-weight: 700;
      }
      
      /* Document body content */
      .markdown-content p {
        color: #333;
        margin: 0.5rem 0;
        line-height: 1.6;
        font-size: 1rem;
      }
      
      /* Print mode adjustments */
      @media print {
        .markdown-content {
          font-size: 10pt;
        }
        
        .section-title {
          font-size: 12pt;
          margin-top: 18pt;
          margin-bottom: 10pt;
        }
        
        .project-title {
          font-size: 16pt;
          margin: 10pt 0 20pt 0;
        }
        
        .markdown-content table {
          page-break-inside: avoid;
          margin: 10pt auto;
        }
        
        .markdown-content th, .markdown-content td {
          padding: 4pt 6pt;
          font-size: 9pt;
        }
      }
    `}</style>
  );
}
