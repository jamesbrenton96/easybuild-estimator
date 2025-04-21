
import React from "react";

interface MarkdownEstimateHeaderProps {
  title?: string;
  projectDetails?: {
    clientName?: string;
    projectAddress?: string;
    date?: string;
  };
}

export default function MarkdownEstimateHeader({ 
  title = "Project Cost Estimate",
  projectDetails
}: MarkdownEstimateHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200 bg-white text-center">
      <h2 className="text-2xl font-bold text-construction-orange mb-2">{title}</h2>
      {projectDetails && (
        <div className="text-sm text-gray-600 space-y-1">
          {projectDetails.clientName && (
            <p><span className="font-medium">Client:</span> {projectDetails.clientName}</p>
          )}
          {projectDetails.projectAddress && (
            <p><span className="font-medium">Address:</span> {projectDetails.projectAddress}</p>
          )}
          {projectDetails.date && (
            <p><span className="font-medium">Date:</span> {projectDetails.date}</p>
          )}
        </div>
      )}
    </div>
  );
}
