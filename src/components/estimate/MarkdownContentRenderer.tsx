
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CustomSpan } from "./markdown/MarkdownCustomSpans";

export default function MarkdownContentRenderer({ content }: { content: string }) {
  return (
    <div className="p-8 markdown-content text-gray-800">
      <style dangerouslySetInnerHTML={{ __html: `
        .markdown-content {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        /* Project type title */
        .markdown-content > p:first-of-type {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0 30px;
        }
        
        /* Section headers */
        .markdown-content h1 {
          color: #333;
          font-size: 18px;
          font-weight: bold;
          margin: 30px 0 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        /* Lists */
        .markdown-content ul {
          list-style: none;
          padding-left: 0;
          margin: 15px 0;
        }
        
        .markdown-content li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 8px;
        }
        
        .markdown-content li:before {
          content: "–";
          position: absolute;
          left: 0;
        }
        
        /* Tables */
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        .markdown-content th {
          background: #f5f5f5;
          font-weight: bold;
          text-align: left;
          padding: 12px;
          border: 1px solid #ddd;
        }
        
        .markdown-content td {
          padding: 12px;
          border: 1px solid #ddd;
        }
        
        .markdown-content td:not(:first-child),
        .markdown-content th:not(:first-child) {
          text-align: right;
        }
        
        .markdown-content tr:nth-child(even) {
          background: #fafafa;
        }
        
        /* Strong text */
        .markdown-content strong {
          color: #333;
          font-weight: bold;
        }
        
        /* Horizontal rule and footer */
        .markdown-content hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 30px 0;
        }
        
        .markdown-content em {
          color: #666;
          font-style: italic;
          font-size: 0.9em;
        }
      `}} />
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          span: CustomSpan,
          table: ({ ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
