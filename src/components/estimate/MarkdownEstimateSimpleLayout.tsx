
import React from "react";
import MarkdownContentRenderer from "./MarkdownContentRenderer";

/**
 * Simplified estimate layout that omits the header and only displays the formatted estimate body.
 */
export default function MarkdownEstimateSimpleLayout({
  formattedMarkdown
}: {
  formattedMarkdown: string;
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <MarkdownContentRenderer content={formattedMarkdown} />
    </div>
  );
}
