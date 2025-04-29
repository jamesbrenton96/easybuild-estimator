
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContentRenderer({ content }: { content: string }) {
  return (
    <div className="p-0 markdown-content text-gray-800">
      <style>{`
        .markdown-content {
          font-family: Arial, sans-serif;
          font-size: 10px;
          line-height: 1.3;
          padding: 12px;
          width: 100%;
        }
        
        /* Project title */
        .markdown-content h1:first-child {
          font-size: 20px;
          color: #e58c33;
          text-align: center;
          margin: 10px 0 25px 0;
          font-weight: bold;
        }
        
        /* Section headings */
        .markdown-content h1, 
        .markdown-content h2 {
          font-size: 14px;
          color: #e58c33;
          margin: 16px 0 8px 0;
          padding-bottom: 5px;
          font-weight: bold;
          border-bottom: 1px solid #e58c33;
        }
        
        /* Basic table styling */
        .markdown-content table { 
          width: 100%;
          margin: 8px 0;
          border-collapse: collapse;
          table-layout: fixed;
        }
        
        .markdown-content td, .markdown-content th { 
          padding: 5px;
          font-size: 9px;
          line-height: 1.3;
          border: 1px solid #ddd;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        
        .markdown-content th {
          font-size: 9px;
          font-weight: bold;
          background-color: #f5f5f5;
          color: #333;
          text-align: left;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
