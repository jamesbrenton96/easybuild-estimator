
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEstimateProps {
  markdownContent: string;
}

export default function MarkdownEstimate({ markdownContent }: MarkdownEstimateProps) {
  // Pre-process the markdown content to clean it up if needed
  const cleanMarkdown = () => {
    let content = markdownContent;
    
    // If the content appears to be JSON-like but containing markdown (from the screenshot)
    if (content.includes('{"type":"text","text":"')) {
      try {
        // Try to extract just the text part from JSON-like format
        const match = content.match(/"text":"(.*?)"]}/s);
        if (match && match[1]) {
          content = match[1]
            .replace(/\\n/g, '\n')  // Replace escaped newlines
            .replace(/\\"/g, '"');  // Replace escaped quotes
        }
      } catch (e) {
        console.error("Error cleaning markdown:", e);
      }
    }
    
    return content;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-gray-800 font-medium text-lg">Construction Cost Estimate</h2>
      </div>
      <div className="p-6 markdown-content text-gray-800">
        <ReactMarkdown 
          className="prose max-w-none prose-headings:text-construction-orange prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-3 prose-p:my-2 prose-a:text-blue-600 prose-strong:text-gray-900 prose-li:my-1 prose-table:border-collapse"
          remarkPlugins={[remarkGfm]}
        >
          {cleanMarkdown()}
        </ReactMarkdown>
      </div>
    </div>
  );
}
