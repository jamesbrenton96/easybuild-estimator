
import React from "react";

interface MarkdownEstimateHeaderProps {
  title?: string;
  projectDetails?: {
    clientName?: string;
    projectAddress?: string;
    projectType?: string;
    date?: string;
  };
}

export default function MarkdownEstimateHeader({ 
  title = "Project Cost Estimate",
  projectDetails
}: MarkdownEstimateHeaderProps) {
  // Arrange details for correspondence section (vertical list)
  const detailItems = [
    projectDetails?.projectType && { label: "Project Type", value: projectDetails.projectType },
    projectDetails?.clientName && { label: "Client", value: projectDetails.clientName },
    projectDetails?.projectAddress && { label: "Location", value: projectDetails.projectAddress },
    projectDetails?.date && { label: "Date", value: projectDetails.date }
  ].filter(Boolean);

  return (
    <div className="p-6 border-b-2 border-construction-orange bg-white text-center">
      {/* Project Name/Title Heading */}
      <h2 className="text-3xl font-black font-sans text-construction-orange mb-2 tracking-tight leading-snug">
        {title}
      </h2>
      
      {/* Correspondence Details Bulleted List */}
      <div className="max-w-md mx-auto mt-5 mb-0 text-left">
        <h3 className="text-construction-orange font-bold text-lg mb-2 uppercase tracking-wide">
          Correspondence Details
        </h3>
        <ul className="list-disc list-inside space-y-1 text-base font-normal text-gray-700">
          {detailItems.map((item: any, idx) => (
            <li key={idx}>
              <span className="font-semibold">{item.label}:</span>{" "}
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
