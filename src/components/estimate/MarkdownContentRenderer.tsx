
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
        
        /* Basic paragraph styling */
        .markdown-content p {
          width: 100% !important;
          margin: 6px 0 !important;
          padding: 0 !important;
          font-size: 10px !important;
          line-height: 1.3 !important;
          color: #222 !important;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
