
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";

interface MarkdownEstimateProps {
  markdownContent: string;
  rawResponse?: any;
}

export default function MarkdownEstimate({ markdownContent, rawResponse }: MarkdownEstimateProps) {
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

  // If we have error content, show error message
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

  // Function to detect if content is likely a real estimate or just input data
  const isRealEstimate = (content: string) => {
    if (!content) return false;
    
    const estimateIndicators = [
      "Total Estimate", 
      "Total Project Cost",
      "Materials & Cost Breakdown",
      "Cost Breakdown",
      "| Item | Cost |", // Table format
      "| Labor", 
      "| Materials"
    ];
    
    // Check for at least two indicators for better reliability
    let indicatorCount = 0;
    estimateIndicators.forEach(indicator => {
      if (content.includes(indicator)) {
        indicatorCount++;
      }
    });
    
    return indicatorCount >= 2 || content.includes("| **Total** |");
  };

  // Process and clean the content
  const cleanedContent = cleanMarkdown();
  
  // Check if we have a real estimate or just input data
  const hasRealEstimate = isRealEstimate(cleanedContent);

  // If it's a real estimate
  if (hasRealEstimate) {
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
            {cleanedContent}
          </ReactMarkdown>
        </div>
      </Card>
    );
  }

  // If it's not a real estimate, show with a warning
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
      </div>
      <div className="p-6 markdown-content text-gray-800">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <div>
              <p className="text-yellow-700">
                <strong>Note:</strong> The estimate service returned your input data only. This may be due to a connection issue with our estimation service.
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Please try again or check back later. For immediate assistance, contact our support team.
              </p>
            </div>
          </div>
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
          {cleanedContent}
        </ReactMarkdown>
      </div>
    </Card>
  );
}
