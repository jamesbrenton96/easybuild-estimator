
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import MarkdownTableStyle from "./MarkdownTableStyle";
import { useFormattedMarkdown } from "./useFormattedMarkdown";

interface MarkdownEstimateProps {
  markdownContent: string;
  rawResponse?: any;
}

export default function MarkdownEstimate({ markdownContent, rawResponse }: MarkdownEstimateProps) {
  useEffect(() => {
    console.log("MarkdownEstimate received content:", {
      contentLength: markdownContent?.length,
      firstChars: markdownContent?.substring(0, 100),
    });
  }, [markdownContent]);

  // Use new formatting hook for all display logic
  const cleanedContent = useFormattedMarkdown(markdownContent);

  if (!cleanedContent) {
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

  // Show regular markdown rendering using our improved cleaner/styler
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
      </div>
      <div className="p-6 markdown-content text-gray-800">
        <MarkdownTableStyle />
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
