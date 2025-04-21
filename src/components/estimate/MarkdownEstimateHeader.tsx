
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
  // Arrange the vertical details as requested
  const detailItems = [
    projectDetails?.projectType && { label: "Project Type", value: projectDetails.projectType },
    projectDetails?.projectAddress && { label: "Location", value: projectDetails.projectAddress },
    projectDetails?.clientName && { label: "Client", value: projectDetails.clientName },
    projectDetails?.date && { label: "Date", value: projectDetails.date }
  ].filter(Boolean);

  return (
    <div className="p-6 border-b-2" style={{ borderColor: '#e58c33', background: '#fff', textAlign: 'center' }}>
      {/* Project Name/Title Heading */}
      <h2
        className="text-3xl font-black font-sans mb-2 tracking-tight leading-snug"
        style={{ color: "#e58c33" }}
      >
        {title}
      </h2>
      {/* Correspondence Details Bulleted List */}
      <div className="max-w-md mx-auto mt-5 mb-0 text-left">
        <h3
          className="font-bold text-lg mb-2 uppercase tracking-wide"
          style={{ color: "#e58c33" }}
        >
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
