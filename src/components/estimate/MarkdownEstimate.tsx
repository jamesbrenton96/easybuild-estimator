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

  if (!markdownContent) {
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

  const cleanMarkdown = () => {
    let cleaned = markdownContent;

    cleaned = cleaned.replace(/\\n/g, "\n")
      .replace(/\\t/g, "    ")
      .replace(/\\"/g, "\"")
      .replace(/\\\\/g, "\\");

    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    cleaned = cleaned.replace(/([^\n])(\#{1,6}\s)/g, '$1\n\n$2');

    cleaned = cleaned.replace(/([^\n])(\|[^\n]*\|)/g, '$1\n$2');
    cleaned = cleaned.replace(/\|[^\n]*\|\s*\n?/g, match => match.trimEnd() + '\n');

    cleaned = cleaned.replace(/([^\n])(- )/g, '$1\n$2');
    cleaned = cleaned.replace(/\n{2,}- /g, '\n\n- ');

    cleaned = cleaned.replace(/(\n-\s[^\n]+)\n(?!- )/g, '$1\n');
    cleaned = cleaned.replace(/(\n\d+\.\s[^\n]+)\n(?!\d+\. )/g, '$1\n');

    cleaned = cleaned.replace(/^```(\w*)/gm, '').replace(/```$/gm, '');

    cleaned = cleaned.replace(/(#{1,6})([^\s#])/gm, '$1 $2');

    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '**$1**');
    cleaned = cleaned.replace(/\*([^*]+)\*/g, '*$1*');

    cleaned = cleaned.trim();

    return cleaned;
  };

  const isErrorContent = 
    !markdownContent || 
    markdownContent?.includes("Sorry, the estimate couldn't be generated") || 
    markdownContent?.includes("Please try again later or contact our support team");

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

  const isRealEstimate = (content: string) => {
    if (!content) return false;
    const estimateIndicators = [
      "Total Estimate", "Total Project Cost", "Materials & Cost Breakdown", "Cost Breakdown",
      "Material Cost Breakdown", "Labor Costs", "Labour Costs", "Construction Cost Estimate",
      "| Item | Cost |", "| Labor", "| Labour", "| Materials", "Project Overview"
    ];
    let indicatorCount = 0;
    estimateIndicators.forEach(indicator => {
      if (content.includes(indicator)) indicatorCount++;
    });
    return indicatorCount >= 1 || 
           content.includes("| **Total** |") || 
           (content.includes("|") && content.includes("---"));
  };

  const cleanedContent = cleanMarkdown();
  const hasRealEstimate = isRealEstimate(cleanedContent);

  if (hasRealEstimate) {
    return (
      <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
        </div>
        <div className="p-6 markdown-content text-gray-800">
          <style>{`
            .markdown-content table {
              border-collapse: collapse;
              margin: 0.75rem auto 1.5rem auto;
              width: 100%;
              background: #f7fafc;
              font-size: 0.98rem;
              box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            }
            .markdown-content th, .markdown-content td {
              border: 1px solid #e5e7eb;
              padding: 0.35em 0.6em;
              text-align: left;
            }
            .markdown-content th {
              background: #f1f5f9;
              font-weight: bold;
              color: #ff8600;
            }
            .markdown-content tr:nth-child(even) td {
              background: #f9fafb;
            }
            .markdown-content tr:last-child td {
              font-weight: 600;
              color: #166534;
            }
          `}</style>
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
