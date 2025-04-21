
import React, { useEffect } from "react";
import MarkdownEstimateSimpleLayout from "./MarkdownEstimateSimpleLayout";
import { useProMarkdownEstimate } from "./useProMarkdownEstimate";

/**
 * Main estimate renderer: displays a highly structured, pro-formatted estimate markdown (no header).
 */
export default function MarkdownEstimate({ 
  markdownContent, 
  rawResponse,
  projectDetails
}: { 
  markdownContent: string, 
  rawResponse?: any,
  projectDetails?: {
    clientName?: string;
    projectAddress?: string;
    date?: string;
  }
}) {
  useEffect(() => {
    console.log("MarkdownEstimate received content:", {
      contentLength: markdownContent?.length,
      firstChars: markdownContent?.substring(0, 100),
    });
  }, [markdownContent]);

  // This custom hook reformats the markdown
  const formatted = useProMarkdownEstimate(markdownContent);

  if (!formatted) {
    // Leave handling empty state to main logic; don't render anything
    return null;
  }

  return (
    <MarkdownEstimateSimpleLayout
      formattedMarkdown={formatted}
    />
  );
}
