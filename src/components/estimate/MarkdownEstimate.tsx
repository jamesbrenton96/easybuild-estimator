
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import MarkdownEstimateHeader from "./MarkdownEstimateHeader";
import MarkdownContentRenderer from "./MarkdownContentRenderer";
import { useSectionedEstimateMarkdown } from "./useSectionedEstimateMarkdown";

/**
 * Main container for displaying a markdown-formatted estimate.
 * Handles empty state, header, and passes cleaned markdown to renderer.
 */
export default function MarkdownEstimate({ markdownContent, rawResponse }: { markdownContent: string, rawResponse?: any }) {
  useEffect(() => {
    console.log("MarkdownEstimate received content:", {
      contentLength: markdownContent?.length,
      firstChars: markdownContent?.substring(0, 100),
    });
  }, [markdownContent]);

  // Refactored: Use the new enhanced hook for more readable/sectioned markdown (tables/headings)
  const enhancedContent = useSectionedEstimateMarkdown(markdownContent);

  if (!enhancedContent) {
    return (
      <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <MarkdownEstimateHeader />
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

  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <MarkdownEstimateHeader />
      <MarkdownContentRenderer content={enhancedContent} />
    </Card>
  );
}
