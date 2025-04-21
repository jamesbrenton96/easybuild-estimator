
import React, { useEffect } from "react";
import MarkdownEstimateLayout from "./MarkdownEstimateLayout";
import { useProMarkdownEstimate } from "./useProMarkdownEstimate";

/**
 * Main estimate renderer: displays a highly structured, pro-formatted estimate markdown.
 * Handles empty state, header, applies advanced number-to-table formatting and prominent headings.
 */
export default function MarkdownEstimate({ markdownContent, rawResponse }: { markdownContent: string, rawResponse?: any }) {
  useEffect(() => {
    console.log("MarkdownEstimate received content:", {
      contentLength: markdownContent?.length,
      firstChars: markdownContent?.substring(0, 100),
    });
  }, [markdownContent]);

  // This custom hook reformats the markdown for pro-level readability (tables, color, spacing)
  const formatted = useProMarkdownEstimate(markdownContent);

  if (!formatted) {
    // Leave handling empty state to main logic; don't render anything
    return null;
  }

  return (
    <MarkdownEstimateLayout formattedMarkdown={formatted} rawResponse={rawResponse} />
  );
}
