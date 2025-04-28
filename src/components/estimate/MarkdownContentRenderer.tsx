
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
           SECTION 9 – Notes & Terms - CRITICAL FIX
           ────────────────────────────────────────────────────────────── */

        /* Make sure notes section heading is orange - but only the heading */
        .markdown-content h1[id*="section-9"],
        .markdown-content h1[id*="notes-and-terms"] {
          color: #e58c33 !important;
          text-transform: uppercase !important;
          font-weight: bold !important;
          border-bottom: 1px solid #e58c33 !important;
        }
        
        /* All content following Notes & Terms heading should be normal black text */
        .markdown-content h1[id*="section-9"] ~ p,
        .markdown-content h1[id*="notes-and-terms"] ~ p,
        .markdown-content h1:last-of-type ~ p {
          font-size: 10px !important;
          color: #000 !important;
          font-weight: normal !important;
          text-transform: none !important;
          border: none !important;
          margin: 6px 0 !important;
          padding: 0 !important;
        }

        /* Fix for numbered list items in Notes & Terms section */
        .markdown-content ol {
          list-style-type: decimal !important;
          margin: 0 0 15px 0 !important;
          padding-left: 16px !important;
          width: 100% !important;
        }

        .markdown-content ol li {
          padding: 3px 0 !important;
          font-size: 10px !important;
          line-height: 1.3 !important;
          width: 100% !important;
          color: #000 !important;
          font-weight: normal !important;
          text-transform: none !important;
          border: none !important;
        }
        
        /* Fix specifically for numbered items in Notes section */
        .markdown-content h1[id*="section-9"] ~ ol,
        .markdown-content h1[id*="notes"] ~ ol,
        .markdown-content h1[id*="terms"] ~ ol,
        .markdown-content h1:last-of-type ~ ol {
          counter-reset: item !important;
          list-style-type: decimal !important;
          margin: 10px 0 15px 0 !important;
          padding-left: 20px !important;
        }
        
        .markdown-content h1[id*="section-9"] ~ ol li,
        .markdown-content h1[id*="notes"] ~ ol li,
        .markdown-content h1[id*="terms"] ~ ol li,
        .markdown-content h1:last-of-type ~ ol li {
          display: block !important;
          font-size: 10px !important;
          color: #000 !important;
          font-weight: normal !important;
          text-transform: none !important;
          border: none !important;
          padding: 3px 0 !important;
          margin: 0 !important;
        }
        
        /* Critical fix for numbered items in the Notes section */
        .markdown-content p:has(> strong:first-child:contains("1.")),
        .markdown-content p:has(> strong:first-child:contains("2.")),
        .markdown-content p:has(> strong:first-child:contains("3.")),
        .markdown-content p:has(> strong:first-child:contains("4.")),
        .markdown-content p:has(> strong:first-child:contains("5.")),
        .markdown-content p:has(> strong:first-child:contains("6.")),
        .markdown-content p:has(> strong:first-child:contains("7.")),
        .markdown-content p:has(> strong:first-child:contains("8.")),
        .markdown-content p:has(> strong:first-child:contains("9.")),
        .markdown-content p:has(> strong:first-child:contains("10.")) {
          color: #000 !important;
          font-weight: normal !important;
          font-size: 10px !important;
          text-transform: none !important;
          border: none !important;
          margin: 6px 0 !important;
        }
        
        /* Ensure number+description following a colon doesn't get themed as a heading */
        .markdown-content strong + span,
        .markdown-content strong:first-child + span {
          color: #000 !important;
          font-weight: normal !important;
          text-transform: none !important;
        }

        /* Extra override for any paragraph that contains a numbered item */
        .markdown-content p strong:first-child,
        .markdown-content p b:first-child {
          display: inline-block !important;
        }

        /* Force normal formatting on Notes & Terms section content */
        #section-9-notes-and-terms ~ p,
        #notes-terms ~ p,
        #notes-and-terms ~ p {
          color: #000 !important;
          font-weight: normal !important;
          font-size: 10px !important;
          text-transform: none !important;
          border: none !important;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
