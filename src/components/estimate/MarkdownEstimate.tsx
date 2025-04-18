
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

  // Process and clean the content
  const cleanedContent = cleanMarkdown();
  
  // Remove duplicate headers and sections
  const removeDuplicateContent = (content: string) => {
    // Split content by headers
    const sections = content.split(/(?=# )/g);
    
    // Filter out duplicate sections
    const uniqueSections: string[] = [];
    const seenHeaders = new Set<string>();
    
    sections.forEach(section => {
      // Extract the header (first line) to use as a key
      const headerMatch = section.match(/^(# [^\n]+)/);
      const header = headerMatch ? headerMatch[1].trim() : '';
      
      // If this is a header section and we haven't seen it before, add it
      if (header && !seenHeaders.has(header)) {
        seenHeaders.add(header);
        uniqueSections.push(section);
      } 
      // If it's not a header section (or header is empty), add it anyway
      else if (!header) {
        uniqueSections.push(section);
      }
    });
    
    return uniqueSections.join('');
  };

  // Apply deep deduplication
  const deduplicateSubsections = (content: string) => {
    // First handle main sections
    let dedupedContent = removeDuplicateContent(content);
    
    // Then handle subsections (## headers)
    const lines = dedupedContent.split('\n');
    const uniqueLines: string[] = [];
    const seenSubHeaders = new Set<string>();
    
    lines.forEach(line => {
      // Check if line is a subheader (## Header)
      if (line.startsWith('## ')) {
        // If we've seen this subheader before, skip it
        if (seenSubHeaders.has(line.trim())) {
          return;
        }
        seenSubHeaders.add(line.trim());
      }
      
      // Add the line to our unique lines
      uniqueLines.push(line);
    });
    
    return uniqueLines.join('\n');
  };

  // Process the content to remove duplicates at all levels
  const processedContent = deduplicateSubsections(cleanedContent);
  
  // Check if the processed content is actually the webhook response
  const isActualEstimate = 
    processedContent.includes("Total Estimate") || 
    processedContent.includes("Total Project Cost") ||
    processedContent.includes("Materials & Cost Breakdown");
  
  // If processed content is just input data and we don't have any actual estimate data,
  // return a simplified version of just the input data
  if (!isActualEstimate && processedContent.includes("Project Overview")) {
    // This is likely just the input data, format it nicer
    return (
      <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
        </div>
        <div className="p-6 markdown-content text-gray-800">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">
              <strong>Note:</strong> The estimate service returned your input data only. 
              This may be due to a connection issue with our estimation service.
            </p>
          </div>
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
            {processedContent}
          </ReactMarkdown>
        </div>
      </Card>
    );
  }

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
          {processedContent}
        </ReactMarkdown>
      </div>
    </Card>
  );
}
