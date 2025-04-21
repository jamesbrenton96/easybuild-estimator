
import React from "react";
import MarkdownEstimateHeader from "./MarkdownEstimateHeader";
import MarkdownContentRenderer from "./MarkdownContentRenderer";

/**
 * Layout wrapper for rendering the estimate header and formatted content.
 *
 * Accepts fully formatted markdown, already "pro-structured" by the hook.
 */
export default function MarkdownEstimateLayout({ formattedMarkdown, rawResponse }: { formattedMarkdown: string, rawResponse?: any }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <MarkdownEstimateHeader />
      <MarkdownContentRenderer content={formattedMarkdown} />
    </div>
  );
}
