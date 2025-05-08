
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
        
        /* List formatting */
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
          color: #222 !important;
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
        
        /* Notes and Terms enhanced styling */
        .markdown-content h1:contains("NOTES AND TERMS"),
        .markdown-content h2:contains("NOTES AND TERMS") {
          font-size: 14px !important;
          margin-top: 25px !important;
        }
        
        /* CRITICAL: Completely hide all numbers in the Notes and Terms section */
        .markdown-content h1:contains("NOTES AND TERMS") ~ p,
        .markdown-content h2:contains("NOTES AND TERMS") ~ p {
          margin: 12px 0 !important;
          line-height: 1.5 !important;
          counter-reset: notes-item !important;
          position: relative !important;
        }
        
        /* Hide numbered prefixes in the Notes and Terms section */
        .markdown-content h1:contains("NOTES AND TERMS") ~ p::before,
        .markdown-content h2:contains("NOTES AND TERMS") ~ p::before {
          content: "" !important;
          display: none !important;
        }
        
        /* Hide any anchor links that might be auto-generated */
        .markdown-content [id^="user-content-"] {
          visibility: hidden !important;
          display: none !important;
        }
        
        /* Additional specific rules for notes and terms section */
        .markdown-content h1:contains("NOTES AND TERMS") ~ p,
        .markdown-content h2:contains("NOTES AND TERMS") ~ p {
          display: block !important;
          position: relative !important;
        }
        
        /* Override and remove any number styling in the Notes section */
        .markdown-content h1:contains("NOTES AND TERMS") ~ p:before,
        .markdown-content h2:contains("NOTES AND TERMS") ~ p:before {
          display: none !important;
          content: "" !important;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
