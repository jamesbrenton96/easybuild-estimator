
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
    <div className="p-6 border-b-2 border-construction-orange bg-white text-center">
      <h2 className="text-3xl font-black font-sans text-construction-orange mb-2 tracking-tight leading-snug">
        {title}
      </h2>
      {projectDetails && (
        <div className="text-base font-semibold text-gray-700 flex flex-col gap-1 items-center mb-2 mt-3">
          {projectDetails.clientName && (
            <span className="font-bold text-lg text-gray-900">
              {projectDetails.clientName}
            </span>
          )}
          {projectDetails.projectAddress && (
            <span className="text-base font-medium text-gray-800">
              {projectDetails.projectAddress}
            </span>
          )}
          {projectDetails.date && (
            <span className="text-base text-gray-600">
              {projectDetails.date}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
