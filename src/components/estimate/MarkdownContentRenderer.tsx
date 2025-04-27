
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
        }
        
        /* Project type title */
        .markdown-content > p:first-of-type {
          font-size: 24px;
          font-weight: 400;
          text-align: center;
          margin: 20px 0 30px;
        }
        
        /* Section headers */
        .markdown-content h1 {
          font-size: 18px;
          font-weight: normal;
          margin: 30px 0 20px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
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
        
        .markdown-content th,
        .markdown-content td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }
        
        .markdown-content td:not(:first-child),
        .markdown-content th:not(:first-child) {
          text-align: right;
        }
        
        .markdown-content tr:nth-child(even) {
          background: #fafafa;
        }
        
        /* No bold headers outside tables */
        .markdown-content strong {
          color: inherit;
          font-weight: bold;
        }
        
        /* Footer */
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
