
import React from "react";
import MarkdownContentRenderer from "./MarkdownContentRenderer";

/**
 * Layout wrapper for rendering formatted markdown content.
 * 
 * Accepts fully formatted markdown, already "pro-structured" by the hook.
 * The custom estimate header has been removed as per user request.
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
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <MarkdownContentRenderer content={formattedMarkdown} />
    </div>
  );
}
