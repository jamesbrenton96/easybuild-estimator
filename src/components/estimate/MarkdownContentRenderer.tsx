
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
        
        /* Special styling for Notes and Terms section */
        .markdown-content h2:contains("NOTES AND TERMS"), 
        .markdown-content h1:contains("NOTES AND TERMS") {
          color: #222 !important;
          border-bottom: 1px solid #222 !important;
        }
        
        /* Make numbered titles in Notes and Terms section black */
        .markdown-content p strong:first-child,
        .markdown-content p:has(strong:first-child) {
          color: #222 !important;
        }
        
        /* Notes & Terms numbered titles specifically */
        .markdown-content p strong:first-child:contains("VALIDITY"),
        .markdown-content p strong:first-child:contains("PAYMENT TERMS"),
        .markdown-content p strong:first-child:contains("EXCLUSIONS"),
        .markdown-content p strong:first-child:contains("VARIATIONS"),
        .markdown-content p strong:first-child:contains("ACCESS CONSIDERATIONS"),
        .markdown-content p strong:first-child:contains("WEATHER CONDITIONS"),
        .markdown-content p strong:first-child:contains("WARRANTY"),
        .markdown-content p strong:first-child:contains("GST"),
        .markdown-content p strong:first-child:contains("SITE CONDITIONS"),
        .markdown-content p strong:first-child:contains("MATERIAL AVAILABILITY") {
          color: #222 !important;
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
        
        /* Make all numbered titles in the Notes section black */
        .markdown-content p:has(strong:contains("1. VALIDITY")),
        .markdown-content p:has(strong:contains("2. PAYMENT TERMS")),
        .markdown-content p:has(strong:contains("3. EXCLUSIONS")),
        .markdown-content p:has(strong:contains("4. VARIATIONS")),
        .markdown-content p:has(strong:contains("5. ACCESS CONSIDERATIONS")),
        .markdown-content p:has(strong:contains("6. WEATHER CONDITIONS")),
        .markdown-content p:has(strong:contains("7. WARRANTY")),
        .markdown-content p:has(strong:contains("8. GST")),
        .markdown-content p:has(strong:contains("9. SITE CONDITIONS")),
        .markdown-content p:has(strong:contains("10. MATERIAL AVAILABILITY")) {
          color: #222 !important;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
