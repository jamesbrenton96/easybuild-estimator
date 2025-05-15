
import React from "react";
import { getFullCorrespondenceType } from "../submitter/markdown/correspondence";

interface MarkdownEstimateHeaderProps {
  title?: string;
  projectDetails?: {
    clientName?: string;
    projectAddress?: string;
    projectType?: string;
    date?: string;
    correspondenceType?: string;
  };
}

export default function MarkdownEstimateHeader({ 
  title = "Project Cost Estimate",
  projectDetails
}: MarkdownEstimateHeaderProps) {
  // Get the full correspondence type if it exists
  const correspondenceType = projectDetails?.correspondenceType || "quote";
  const fullCorrespondenceType = getFullCorrespondenceType(correspondenceType);
  
  return (
    <div className="p-6 bg-white text-center">
      {/* Logo */}
      <div className="mb-4">
        <img 
          src="/lovable-uploads/54be63ea-83fd-4f4a-8c94-dba12936b674.png" 
          alt="Brenton Building" 
          className="h-16 mx-auto"
        />
      </div>
      
      {/* Project Name/Title Heading */}
      <h2 className="text-2xl font-bold text-construction-orange mb-8">
        {title || projectDetails?.projectType || "Project Cost Estimate"}
      </h2>
      
      {/* Section 1: Correspondence */}
      <div className="text-left">
        <h2 className="section-title text-construction-orange uppercase font-bold border-b border-construction-orange pb-1 mb-4">
          SECTION 1: CORRESPONDENCE
        </h2>
        
        <div className="ml-1">
          <div className="correspondence-item flex mb-2">
            <div className="correspondence-label font-semibold w-32">Correspondence</div>
            <div></div>
          </div>
          
          <div className="correspondence-item flex mb-2">
            <div className="correspondence-label font-semibold w-32">Type:</div>
            <div>{fullCorrespondenceType}</div>
          </div>
          
          <div className="correspondence-item flex mb-2">
            <div className="correspondence-label font-semibold w-32">Client Name:</div>
            <div>{projectDetails?.clientName || "Client"}</div>
          </div>
          
          <div className="correspondence-item flex mb-2">
            <div className="correspondence-label font-semibold w-32">Project Address:</div>
            <div>{projectDetails?.projectAddress || "Project Location"}</div>
          </div>
          
          <div className="correspondence-item flex mb-2">
            <div className="correspondence-label font-semibold w-32">Current Date:</div>
            <div>{projectDetails?.date || new Date().toLocaleDateString()}</div>
          </div>
          
          <div className="correspondence-item flex mb-2">
            <div className="correspondence-label font-semibold w-32">Project Name:</div>
            <div>{title || projectDetails?.projectType || "Construction Project"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
