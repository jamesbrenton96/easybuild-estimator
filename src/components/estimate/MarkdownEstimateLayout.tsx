
import React from "react";
import MarkdownEstimateHeader from "./MarkdownEstimateHeader";
import MarkdownContentRenderer from "./MarkdownContentRenderer";

/**
 * Layout wrapper for rendering the estimate header and formatted content.
 * 
 * Accepts fully formatted markdown, already "pro-structured" by the hook.
 */
export default function MarkdownEstimateLayout({ 
  formattedMarkdown, 
  rawResponse,
  projectDetails
}: { 
  formattedMarkdown: string, 
  rawResponse?: any,
  projectDetails?: {
    clientName?: string;
    projectAddress?: string;
    date?: string;
  }
}) {
  // Extract title from markdown if it starts with a # heading
  const titleMatch = formattedMarkdown.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : "Project Cost Estimate";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <MarkdownEstimateHeader 
        title={title} 
        projectDetails={projectDetails} 
      />
      <MarkdownContentRenderer content={formattedMarkdown} />
    </div>
  );
}
