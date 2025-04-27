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
        }
        
        /* Section titles format */
        .section-title {
          color: #e58c33 !important;
          text-transform: uppercase !important;
          font-weight: bold !important;
          border-bottom: 1px solid #e58c33 !important;
          padding: 0 0 5px 0 !important;
          margin-bottom: 12px !important;
          margin-top: 22px !important;
          font-size: 14px !important;
          letter-spacing: 0.03em !important;
        }
        
        /* Table styles */
        .markdown-content table { 
          page-break-inside: avoid !important;
          width: 100% !important;
          max-width: 100% !important;
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
        
        /* Notes & Terms formatting */
        .markdown-content h1:contains("Notes & Terms") + p {
          font-weight: bold !important;
          font-size: 12px !important;
          margin-top: 15px !important;
          margin-bottom: 5px !important;
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
          width: 100% !important;
        }
        
        .markdown-content ul li::marker {
          color: #e58c33 !important;
        }
        
        /* Notes & Terms section special formatting */
        .markdown-content h1:contains("Notes & Terms") ~ p {
          font-weight: bold !important;
          margin-top: 15px !important;
          margin-bottom: 5px !important;
        }
        
        .markdown-content h1:contains("Notes & Terms") ~ ul {
          margin-top: 5px !important;
          margin-bottom: 15px !important;
        }
        
        /* Project title */
        .markdown-content h1:first-child {
          font-size: 20px !important;
          color: #e58c33 !important;
          text-align: center !important;
          margin: 10px 0 25px 0 !important;
          font-weight: bold !important;
          border-bottom: none !important;
        }
        
        /* Correspondence section */
        .correspondence-item {
          display: flex !important;
          margin-bottom: 5px !important;
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
        }
        
        .notes-terms p {
          margin: 6px 0 !important;
          font-size: 10px !important;
        }
        
        /* Override any orange text with standard color */
        .markdown-content p {
          width: 100% !important;
          margin: 6px 0 !important;
          padding: 0 !important;
          font-size: 10px !important;
          line-height: 1.3 !important;
        }
        
        .markdown-content strong, .markdown-content b {
          color: #333 !important;
          font-weight: bold !important;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
