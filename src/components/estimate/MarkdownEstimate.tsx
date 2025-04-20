
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface MarkdownEstimateProps {
  markdownContent: string;
  rawResponse?: any;
}

export default function MarkdownEstimate({ markdownContent, rawResponse }: MarkdownEstimateProps) {
  useEffect(() => {
    console.log("MarkdownEstimate received content:", { 
      contentLength: markdownContent?.length,
      firstChars: markdownContent?.substring(0, 100)
    });
  }, [markdownContent]);

  // Skip rendering if no content
  if (!markdownContent) {
    console.error("No markdown content provided to MarkdownEstimate");
    return (
      <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
        </div>
        <div className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-gray-800 text-lg font-medium mb-3">No Estimate Content</h2>
          <p className="text-gray-600 mb-4">
            We received a response from the estimation service but it contained no displayable content.
          </p>
        </div>
      </Card>
    );
  }

  // Clean the markdown by handling escape characters and ensuring proper line breaks
  const cleanMarkdown = () => {
    // Replace shortened correspondence types with full versions
    let cleanedContent = markdownContent
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\t/g, '    ');
      
    // Ensure proper line breaks between sections
    // Add proper line breaks before headers if missing
    cleanedContent = cleanedContent.replace(/([^\n])#{1,6}\s/g, '$1\n\n#');
    
    // Ensure tables have proper formatting with line breaks
    if (cleanedContent.includes('|')) {
      // Make sure there are proper line breaks before and after tables
      cleanedContent = cleanedContent
        .replace(/(\w+)(\s*\|)/g, '$1\n$2')  // Add line break before table if needed
        .replace(/\|\s*\n/g, '|\n')          // Ensure line breaks after table rows
        .replace(/\n+## /g, '\n\n## ');      // Ensure double line breaks before section headers
    }
    
    // Ensure headers have space after #
    cleanedContent = cleanedContent.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');
    
    // Fix any missing line breaks before/after lists
    cleanedContent = cleanedContent
      .replace(/([^\n])(- )/g, '$1\n$2')
      .replace(/(- [^\n]+)([^\n-])/g, '$1\n$2');
    
    return cleanedContent;
  };

  // Check if the content is empty or includes specific error phrases
  const isErrorContent = 
    !markdownContent || 
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
      "Material Cost Breakdown",
      "Labor Costs",
      "Labour Costs",
      "Construction Cost Estimate",
      "| Item | Cost |", // Table format
      "| Labor", 
      "| Labour",
      "| Materials",
      "Project Overview"
    ];
    
    // Check for at least one indicator for better reliability
    let indicatorCount = 0;
    estimateIndicators.forEach(indicator => {
      if (content.includes(indicator)) {
        indicatorCount++;
      }
    });
    
    return indicatorCount >= 1 || 
           content.includes("| **Total** |") || 
           (content.includes("|") && content.includes("---"));
  };

  // Process and clean the content
  const cleanedContent = cleanMarkdown();
  console.log("Cleaned content first 100 chars:", cleanedContent.substring(0, 100));
  
  // Check if we have a real estimate
  const hasRealEstimate = isRealEstimate(cleanedContent);
  console.log("Is real estimate:", hasRealEstimate);

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
              prose-table:border-collapse prose-table:w-full prose-table:my-4 
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

  // Add debugging alert if we have content that doesn't match our estimate pattern
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
      </div>
      <div className="p-6">
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <AlertTitle className="text-yellow-700">Content Format Notice</AlertTitle>
          <AlertDescription className="text-yellow-600">
            The response doesn't match our typical estimate format.
            We're displaying what we received from the estimation service.
          </AlertDescription>
        </Alert>
        
        <div className="markdown-content text-gray-800">
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
              prose-table:border-collapse prose-table:w-full prose-table:my-4 
              prose-th:bg-gray-100 prose-th:p-2 prose-th:border prose-th:border-gray-300 prose-th:text-left
              prose-td:border prose-td:border-gray-300 prose-td:p-2 prose-td:break-words
              prose-hr:my-6"
            remarkPlugins={[remarkGfm]}
          >
            {cleanedContent}
          </ReactMarkdown>
        </div>
      </div>
    </Card>
  );
}
