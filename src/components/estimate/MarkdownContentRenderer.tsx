
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContentRenderer({ content }: { content: string }) {
  return (
    <div className="p-0 markdown-content text-gray-800">
      <style>{`
        .markdown-content {
          font-family: Arial, sans-serif !important;
          font-size: 10px !important;
          line-height: 1.3 !important;
          padding: 12px !important;
          width: 100% !important;
        }
        
        /* SECTION HEADERS */
        .markdown-content h2, .markdown-content h1 {
          color: #e58c33 !important;
          font-size: 14px !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          margin-top: 22px !important;
          margin-bottom: 12px !important;
          padding: 0 0 6px 0 !important;
          border-bottom: 1px solid #e58c33 !important;
          letter-spacing: 0.03em !important;
          width: 100% !important;
        }
        
        /* Table styles */
        .markdown-content table { 
          width: 100% !important;
          margin: 8px 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
        }
        
        .markdown-content td, .markdown-content th { 
          padding: 5px !important;
          font-size: 9px !important;
          line-height: 1.3 !important;
          border: 1px solid #ddd !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
        }
        
        .markdown-content th {
          font-size: 9px !important;
          font-weight: bold !important;
          background-color: #f5f5f5 !important;
          color: #333 !important;
          text-align: left !important;
        }
        
        /* List formatting - updated for full width */
        .markdown-content ul {
          margin: 0 0 15px 0 !important;
          padding-left: 16px !important;
          width: 100% !important;
        }
        
        .markdown-content ul li {
          padding: 3px 0 !important;
          font-size: 10px !important;
          line-height: 1.3 !important;
          width: 100% !important;
        }
        
        .markdown-content ul li::marker {
          color: #e58c33 !important;
        }
        
        /* Project title */
        .markdown-content h1:first-child {
          font-size: 20px !important;
          color: #e58c33 !important;
          text-align: center !important;
          margin: 10px 0 25px 0 !important;
          font-weight: bold !important;
          border-bottom: none !important;
          width: 100% !important;
        }
        
        /* Correspondence section */
        .correspondence-item {
          display: flex !important;
          margin-bottom: 5px !important;
          width: 100% !important;
        }
        
        .correspondence-label {
          width: 120px !important;
          font-weight: bold !important;
        }
        
        /* Total cost highlighting */
        .total-project-cost {
          font-weight: bold !important;
          background-color: #f5f5f5 !important;
        }
        
        /* Notes and terms */
        .notes-terms {
          margin-top: 20px !important;
          width: 100% !important;
        }
        
        .notes-terms p {
          margin: 6px 0 !important;
          font-size: 10px !important;
          width: 100% !important;
        }
        
        /* Override any orange text with standard color */
        .markdown-content p {
          width: 100% !important;
          margin: 6px 0 !important;
          padding: 0 !important;
          font-size: 10px !important;
          line-height: 1.3 !important;
          color: #222 !important;
        }
        
        .markdown-content strong, .markdown-content b {
          color: #333 !important;
          font-weight: bold !important;
        }

        /* ──────────────────────────────────────────────────────────────
           SECTION 9 – Notes & Terms
           ────────────────────────────────────────────────────────────── */

        /* Allow "Notes & Terms" section heading to keep orange styling */
        .markdown-content h1[id*="section-9"], 
        .markdown-content h1[id*="notes"], 
        .markdown-content h1[id*="terms"] {
          /* Keep existing orange styling */
        }

        /* Override numbering styles for Notes & Terms section */
        .markdown-content h1[id*="section-9"] ~ p, 
        .markdown-content h1[id*="notes"] ~ p,
        .markdown-content h1[id*="terms"] ~ p {
          font-weight: normal;
          color: #000 !important;
          border: none;
          text-transform: none;
          font-size: 10px !important;
          margin: 6px 0 !important;
        }

        /* Make numbered list items normal text, not orange headings */
        .markdown-content h1[id*="section-9"] ~ ol li,
        .markdown-content h1[id*="notes"] ~ ol li,
        .markdown-content h1[id*="terms"] ~ ol li,
        .markdown-content h1:last-of-type ~ ol li {
          font-weight: normal !important;
          color: #000 !important;
          border: none !important;
          text-transform: none !important;
          font-size: 10px !important;
          padding: 3px 0 !important;
        }

        /* Same for unnumbered list items */
        .markdown-content h1[id*="section-9"] ~ ul li,
        .markdown-content h1[id*="notes"] ~ ul li,
        .markdown-content h1[id*="terms"] ~ ul li,
        .markdown-content h1:last-of-type ~ ul li {
          font-weight: normal !important; 
          color: #000 !important;
          border: none !important;
          text-transform: none !important;
          font-size: 10px !important;
        }

        /* Bold keywords before colons in list items */
        .markdown-content h1[id*="section-9"] ~ ul li strong,
        .markdown-content h1[id*="notes"] ~ ul li strong,
        .markdown-content h1[id*="terms"] ~ ul li strong,
        .markdown-content h1[id*="section-9"] ~ ol li strong,
        .markdown-content h1[id*="notes"] ~ ol li strong,
        .markdown-content h1[id*="terms"] ~ ol li strong,
        .markdown-content h1:last-of-type ~ ul li strong,
        .markdown-content h1:last-of-type ~ ol li strong {
          font-weight: bold !important;
          color: #000 !important;
        }

        /* Fix numbered items with prefixes like "1. PAYMENT TERMS" */
        .markdown-content h1[id*="section-9"] ~ ol li:before,
        .markdown-content h1[id*="notes"] ~ ol li:before,
        .markdown-content h1[id*="terms"] ~ ol li:before,
        .markdown-content h1:last-of-type ~ ol li:before {
          color: #000 !important;
          font-weight: normal !important;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
