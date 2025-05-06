
import React from "react";

/**
 * All table/markdown-specific styling to apply to estimate markdown output.
 * Designed to match the Brenton Building template format.
 */
export default function MarkdownTableStyle() {
  return (
    <style>{`
      .markdown-content {
        font-family: Arial, sans-serif !important;
      }
      
      /* Project title */
      .project-title {
        font-size: 24px !important;
        color: #e58c33 !important;
        text-align: center !important;
        margin: 20px 0 30px 0 !important;
        font-weight: bold !important;
      }
      
      /* Section headers - matching Brenton template */
      .section-title {
        color: #e58c33 !important;
        text-transform: uppercase !important;
        font-weight: bold !important;
        border-bottom: 1px solid #e58c33 !important;
        padding-bottom: 5px !important;
        margin-bottom: 15px !important;
        margin-top: 25px !important;
        font-size: 16px !important;
        letter-spacing: 0.03em !important;
      }
      
      /* Notes and Terms - ensure all text is black, not orange */
      .markdown-content h1:contains("NOTES AND TERMS"),
      .markdown-content h1:contains("notes and terms") {
        color: #e58c33 !important;
      }
      
      .markdown-content h1:contains("NOTES AND TERMS") ~ ol li,
      .markdown-content h1:contains("NOTES AND TERMS") ~ ul li,
      .markdown-content h1:contains("NOTES AND TERMS") ~ p,
      .markdown-content h1:contains("notes and terms") ~ ol li,
      .markdown-content h1:contains("notes and terms") ~ ul li,
      .markdown-content h1:contains("notes and terms") ~ p {
        color: #222 !important;
        font-weight: normal !important;
      }
      
      /* Make sure the entire Notes and Terms content is black */
      .markdown-content h1:contains("NOTES AND TERMS") ~ ol li *,
      .markdown-content h1:contains("NOTES AND TERMS") ~ ul li *,
      .markdown-content h1:contains("NOTES AND TERMS") ~ p *,
      .markdown-content h1:contains("NOTES AND TERMS") ~ * strong,
      .markdown-content h1:contains("NOTES AND TERMS") ~ * span,
      .markdown-content h1:contains("notes and terms") ~ ol li *,
      .markdown-content h1:contains("notes and terms") ~ ul li *,
      .markdown-content h1:contains("notes and terms") ~ p *,
      .markdown-content h1:contains("notes and terms") ~ * strong,
      .markdown-content h1:contains("notes and terms") ~ * span {
        color: #222 !important;
        font-weight: normal !important;
      }
      
      /* Special case for the numbered items in Notes and Terms */
      .markdown-content h1:contains("NOTES AND TERMS") ~ p,
      .markdown-content h1:contains("notes and terms") ~ p {
        color: #222 !important;
      }
      
      /* Table styles matching Brenton template */
      .markdown-content table, .estimate-table {
        border-collapse: collapse;
        margin: 1rem auto 1.5rem auto;
        width: 100%;
        background: #fff;
        font-size: 0.9rem;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
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
      
      /* Correspondence items */
      .correspondence-item {
        display: flex;
        margin-bottom: 6px;
      }
      
      .correspondence-label {
        width: 140px;
        font-weight: bold;
      }
      
      /* Document body content */
      .markdown-content p {
        color: #333;
        margin: 0.5rem 0;
        line-height: 1.6;
        font-size: 1rem;
      }
      
      /* Bullet points styling */
      .markdown-content ul {
        margin: 0.5rem 0 1rem 0;
        padding-left: 0;
      }
      
      .markdown-content li {
        margin-bottom: 0.5rem;
        line-height: 1.6;
        font-size: 1rem;
        color: #333;
      }
      
      /* Custom list formatting */
      .markdown-content li:has(.text-construction-orange) {
        display: flex;
        align-items: flex-start;
      }
      
      /* Document footer */
      .document-footer {
        margin-top: 30px;
        font-size: 0.75rem;
        color: #666;
        text-align: center;
        border-top: none;
      }
      
      /* Make sure total rows stand out */
      .markdown-content tr:has(td:first-child:contains("TOTAL")),
      .markdown-content tr:has(td:first-child:contains("Total")) {
        font-weight: bold;
        background-color: #f5f5f5;
      }
      
      /* Print mode adjustments */
      @media print {
        .markdown-content {
          font-size: 10pt !important;
        }
        
        .section-title {
          font-size: 12pt !important;
          margin-top: 18pt !important;
          margin-bottom: 10pt !important;
        }
        
        .project-title {
          font-size: 16pt !important;
          margin: 10pt 0 20pt 0 !important;
        }
        
        .markdown-content table {
          page-break-inside: avoid;
          margin: 10pt auto !important;
        }
        
        .markdown-content th, .markdown-content td {
          padding: 4pt 6pt !important;
          font-size: 9pt !important;
        }
        
        .document-footer {
          margin-top: 20pt !important;
          font-size: 7pt !important;
        }
      }
    `}</style>
  );
}
