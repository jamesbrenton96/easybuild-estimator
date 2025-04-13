
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";

interface MarkdownEstimateProps {
  markdownContent: string;
}

export default function MarkdownEstimate({ markdownContent }: MarkdownEstimateProps) {
  // Pre-process the markdown content to clean it up
  const cleanMarkdown = () => {
    let content = markdownContent;
    
    // Handle JSON-like structure with text fields
    if (content.includes('"type":"text"') || content.includes('[{"type":"text"')) {
      try {
        // First, try to parse as complete JSON if it looks like a valid array
        if (content.trim().startsWith('[') && content.trim().endsWith(']')) {
          try {
            const parsedJson = JSON.parse(content);
            if (Array.isArray(parsedJson)) {
              // Extract text from each object in the array
              content = parsedJson
                .filter(item => item.type === 'text' && item.text)
                .map(item => item.text)
                .join('\n');
            }
          } catch (e) {
            console.log("Not complete JSON, trying regex extraction");
          }
        }
        
        // If still contains JSON markers, use regex extraction
        if (content.includes('"type":"text"')) {
          // Extract the actual text content from JSON structure
          const regex = /"text":"([\s\S]*?)(?:",|"})/g;
          let extractedText = '';
          let match;
          
          while ((match = regex.exec(content)) !== null) {
            // Replace escaped newlines with actual newlines
            let textPart = match[1]
              .replace(/\\n/g, '\n')
              .replace(/\\"/g, '"');
            
            extractedText += textPart;
          }
          
          if (extractedText) {
            content = extractedText;
          }
        }
      } catch (e) {
        console.error("Error cleaning markdown:", e);
      }
    }
    
    // Clean up any remaining artifacts
    content = content
      .replace(/\[\{/g, '') // Remove opening bracket with brace
      .replace(/\}\]/g, '') // Remove closing brace with bracket
      .replace(/\\"type\\":\\"text\\",\\"text\\":\\"/g, '') // Remove type:text markers
      .replace(/\\n/g, '\n') // Replace any remaining escaped newlines
      .replace(/\|n\|/g, '\n') // Replace pipe n pipe with newline
      .replace(/\\n\\n/g, '\n\n') // Replace double escaped newlines
      .replace(/"\s*\|\s*"/g, ' | ') // Fix table separators
      .replace(/\\t/g, '    ') // Replace tabs with spaces
      .replace(/\\"/g, '"') // Replace escaped quotes
      .replace(/\\\\/g, '\\') // Replace double backslashes
      .replace(/^"|"$/g, ''); // Remove surrounding quotes
    
    // Format tables properly
    content = content.replace(/---+/g, '---|---'); // Fix markdown table separators
    
    console.log("Cleaned markdown content:", content);
    return content;
  };

  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
      </div>
      <div className="p-6 markdown-content text-gray-800">
        <ReactMarkdown 
          className="prose max-w-none 
            prose-headings:text-construction-orange prose-headings:font-semibold 
            prose-h1:text-2xl prose-h1:mb-6 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-3
            prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-4 
            prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-3
            prose-p:my-3 prose-p:leading-relaxed
            prose-a:text-blue-600 
            prose-strong:text-gray-900 prose-strong:font-medium
            prose-li:my-1 prose-li:ml-2
            prose-table:border-collapse prose-table:w-full prose-table:my-4
            prose-th:bg-gray-100 prose-th:p-2 prose-th:border prose-th:border-gray-300 prose-th:text-left
            prose-td:border prose-td:border-gray-300 prose-td:p-2
            prose-hr:my-6"
          remarkPlugins={[remarkGfm]}
        >
          {cleanMarkdown()}
        </ReactMarkdown>
      </div>
    </Card>
  );
}
