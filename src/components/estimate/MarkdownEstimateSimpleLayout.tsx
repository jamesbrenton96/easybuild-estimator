
import React from "react";
import MarkdownContentRenderer from "./MarkdownContentRenderer";

export default function MarkdownEstimateSimpleLayout({
  formattedMarkdown
}: {
  formattedMarkdown: string;
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8 max-w-[210mm] mx-auto">
      <div className="p-0 m-0">
        <MarkdownContentRenderer content={formattedMarkdown} />
      </div>
    </div>
  );
}
