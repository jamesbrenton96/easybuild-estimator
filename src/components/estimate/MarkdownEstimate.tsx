
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";

interface MarkdownEstimateProps {
  markdownContent: string;
}

export default function MarkdownEstimate({ markdownContent }: MarkdownEstimateProps) {
  // Simple cleaning function that handles escape characters
  const cleanMarkdown = () => {
    // Replace shortened correspondence types with full versions
    let cleanedContent = markdownContent
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
      
    return cleanedContent;
  };

  // Check if the content includes error phrases
  const isErrorContent = 
    markdownContent?.includes("Sorry, the estimate couldn't be generated") || 
    markdownContent?.includes("Please try again later or contact our support team");

  // If we have error content, use FallbackEstimate component instead
  if (isErrorContent) {
    return (
      <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
        </div>
        <div className="p-6 text-center">
          <h2 className="text-xl font-medium text-construction-orange mb-4">Unable to Generate Estimate</h2>
          <p className="text-gray-700 mb-4">
            We were unable to generate an estimate based on the information provided. Please try again or contact support.
          </p>
        </div>
      </Card>
    );
  }

  // Check if content has duplicate headers (a common issue when concatenating content)
  const removeDuplicateHeaders = (content: string) => {
    const lines = content.split('\n');
    const uniqueLines: string[] = [];
    const seenHeaders = new Set<string>();
    
    lines.forEach(line => {
      // Check if line is a header
      if (line.startsWith('# ') || line.startsWith('## ')) {
        // If we've seen this header before, skip it
        if (seenHeaders.has(line.trim())) {
          return;
        }
        seenHeaders.add(line.trim());
      }
      
      // Add the line to our unique lines
      uniqueLines.push(line);
    });
    
    return uniqueLines.join('\n');
  };

  // Process and clean the content
  const processedContent = removeDuplicateHeaders(cleanMarkdown());
  
  // If content starts with "Construction Cost Estimate" multiple times, remove duplicates
  const dedupedContent = processedContent.replace(
    /(# Construction Cost Estimate[\s\S]*?)(# Construction Cost Estimate)/g, 
    "$1"
  );

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
            prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2
            prose-p:my-3 prose-p:leading-relaxed
            prose-a:text-blue-600 
            prose-strong:text-gray-900 prose-strong:font-medium
            prose-li:my-1 prose-li:ml-2
            prose-table:border-collapse prose-table:w-full prose-table:my-4 prose-table:table-fixed
            prose-th:bg-gray-100 prose-th:p-2 prose-th:border prose-th:border-gray-300 prose-th:text-left
            prose-td:border prose-td:border-gray-300 prose-td:p-2 prose-td:break-words
            prose-hr:my-6"
          remarkPlugins={[remarkGfm]}
        >
          {dedupedContent}
        </ReactMarkdown>
      </div>
    </Card>
  );
}
