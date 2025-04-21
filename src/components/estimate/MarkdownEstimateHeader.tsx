
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
  const detailItems = [
    projectDetails?.clientName && { label: "Client", value: projectDetails.clientName },
    projectDetails?.projectAddress && { label: "Location", value: projectDetails.projectAddress },
    projectDetails?.date && { label: "Date", value: projectDetails.date }
  ].filter(Boolean);

  return (
    <div className="p-6 border-b-2 border-construction-orange bg-white text-center">
      <h2 className="text-3xl font-black font-sans text-construction-orange mb-2 tracking-tight leading-snug">
        {title}
      </h2>
      {detailItems.length > 0 && (
        <ul className="text-base font-normal text-gray-700 flex flex-col gap-1 items-start mx-auto mt-3 mb-2 list-disc list-inside max-w-md">
          {detailItems.map((item: any, idx) => (
            <li key={idx} className="text-gray-800">
              <span className="font-semibold mr-1">{item.label}:</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
