
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";

interface MarkdownEstimateProps {
  markdownContent: string;
  rawResponse?: any;
}

export default function MarkdownEstimate({ markdownContent, rawResponse }: MarkdownEstimateProps) {
  // Log raw response data when available for debugging
  useEffect(() => {
    if (rawResponse) {
      console.log("MarkdownEstimate received raw response:", rawResponse);
      
      // Check if rawResponse contains expected estimate data structures
      if (typeof rawResponse === 'object') {
        console.log("Raw response contains these keys:", Object.keys(rawResponse));
        
        if (rawResponse.textLong) {
          console.log("textLong field is present with length:", rawResponse.textLong.length);
          console.log("textLong preview:", rawResponse.textLong.substring(0, 100) + "...");
        }
        
        if (rawResponse.markdownContent) {
          console.log("markdownContent field is present with length:", rawResponse.markdownContent.length);
          console.log("markdownContent preview:", rawResponse.markdownContent.substring(0, 100) + "...");
        }
      }
    }
  }, [rawResponse]);

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
  
  // Improved function to detect if content is likely a real estimate
  const isActualEstimate = (content: string) => {
    if (!content) return false;
    
    // Log the content for debugging
    console.log("Checking if content is a real estimate. Content preview:", 
      content.substring(0, 100) + "...");
    
    // Look for the specific Make.com response markers
    if (content.includes("Planter Box Construction Cost Estimate") &&
        content.includes("Materials & Cost Breakdown") &&
        content.includes("Total Project Cost")) {
      console.log("Content identified as a real estimate based on specific markers");
      return true;
    }
    
    const estimateIndicators = [
      "Total Estimate", 
      "Total Project Cost",
      "Materials & Cost Breakdown",
      "Materials Cost Breakdown",
      "Labor Costs",
      "Labour Costs",
      "Cost Breakdown",
      "Material Details & Calculations",
      "| Item | Quantity | Unit Price",     // Table header formats
      "| Materials Subtotal |",             // Common table formats
      "| Labor Subtotal |",                 // Common table formats (US spelling)
      "| Labour Subtotal |",                // Common table formats (UK/NZ spelling)
      "Materials (including GST",           // Common total line
      "Labor (including GST",               // Common total line
      "Labour (including GST"               // Common total line
    ];
    
    // Check each indicator and log when found
    let foundIndicators = [];
    estimateIndicators.forEach(indicator => {
      if (content.includes(indicator)) {
        foundIndicators.push(indicator);
      }
    });
    
    if (foundIndicators.length > 0) {
      console.log("Content identified as a real estimate based on indicators:", foundIndicators);
      return true;
    }
    
    console.log("Content does not appear to be a real estimate");
    return false;
  };
  
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
  
  // Use improved detection logic for Make.com response
  const estimateReceived = isActualEstimate(processedContent);
  console.log("Estimate detection result:", estimateReceived);
  
  // Check if content contains input data headers that would indicate it's just the input
  const isJustInputData = 
    processedContent.includes("Project Overview") && 
    !estimateReceived &&
    (processedContent.includes("Specific Notes and terms") || 
     processedContent.includes("Hourly Rates") ||
     processedContent.includes("Additional Work"));
  
  console.log("Is this just input data?", isJustInputData);
  
  // If it looks like a real estimate or has tables (including the Make.com response)
  if (estimateReceived || processedContent.includes("|")) {
    console.log("Rendering actual estimate content");
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
  
  // If it's just input data, show a better fallback
  if (isJustInputData) {
    console.log("Rendering input data with warning");
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
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <p className="text-blue-700">
                  <strong>Debug Info:</strong> We're investigating why the estimate generation returned input data only.
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Please check the browser console (F12) for more technical details that can help support diagnose the issue.
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
            {processedContent}
          </ReactMarkdown>
        </div>
      </Card>
    );
  }

  // Default case - just show the content with a warning
  console.log("Rendering default content with warning");
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
                <strong>Note:</strong> The content below may not be a complete estimate.
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Debug information has been logged to the browser console (F12) to help troubleshoot the estimate generation.
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
          {processedContent}
        </ReactMarkdown>
      </div>
    </Card>
  );
}
