
import React from "react";

interface ReviewDetailsProps {
  formData: any;
}

export default function ReviewDetails({ formData }: ReviewDetailsProps) {
  // Helper function to get the full correspondence type name
  const getFullCorrespondenceType = (type: string) => {
    switch (type?.toLowerCase()) {
      case "accurate":
        return "Accurate Estimate";
      case "ballpark":
        return "Ballpark Estimate";
      case "quotation":
        return "Fixed Price Quotation";
      case "quote":
        return "Quotation";
      case "preliminary":
        return "Preliminary Estimate";
      case "proposal":
        return "Proposal";
      default:
        return type || "Estimate";
    }
  };
  
  // Ensure files array exists
  const files = formData.files || [];
  
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-gray-500 text-sm">Project Type</h3>
          <p className="text-gray-800 font-medium">{formData.projectType}</p>
        </div>
        
        {formData.subcategories?.correspondence?.type && (
          <div>
            <h3 className="text-gray-500 text-sm">Correspondence Type</h3>
            <p className="text-gray-800 font-medium">
              {getFullCorrespondenceType(formData.subcategories.correspondence.type)}
            </p>
          </div>
        )}
        
        {formData.subcategories?.correspondence?.clientName && (
          <div>
            <h3 className="text-gray-500 text-sm">Client Name</h3>
            <p className="text-gray-700">{formData.subcategories.correspondence.clientName}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-gray-500 text-sm">Location</h3>
          <p className="text-gray-700">{formData.location}</p>
        </div>
        
        <div>
          <h3 className="text-gray-500 text-sm">Supporting Documents</h3>
          {files.length > 0 ? (
            <p className="text-gray-700">{files.length} file(s) attached</p>
          ) : (
            <p className="text-gray-500">No files attached</p>
          )}
        </div>
      </div>
    </div>
  );
}
