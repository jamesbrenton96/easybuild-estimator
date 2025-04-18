
import React from "react";
import { FileText, Image, File } from "lucide-react";

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
  
  // Get file type icon
  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      return <Image className="h-5 w-5 text-construction-orange" />;
    }
    
    return <File className="h-5 w-5 text-blue-500" />;
  };
  
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
            <div className="space-y-2">
              <p className="text-gray-700">{files.length} file(s) attached</p>
              <ul className="space-y-1 max-h-32 overflow-y-auto rounded-md bg-gray-50 p-2">
                {files.map((file: File, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    {getFileIcon(file)}
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-gray-400">({Math.round(file.size / 1024)} KB)</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">No files attached</p>
          )}
        </div>
      </div>
    </div>
  );
}
