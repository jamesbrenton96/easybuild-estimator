
import React from "react";

interface ReviewDetailsProps {
  formData: any;
}

export default function ReviewDetails({ formData }: ReviewDetailsProps) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-gray-500 text-sm">Project Type</h3>
          <p className="text-gray-800 font-medium">{formData.projectType}</p>
        </div>
        
        <div>
          <h3 className="text-gray-500 text-sm">Description</h3>
          <p className="text-gray-700">{formData.description}</p>
        </div>
        
        <div>
          <h3 className="text-gray-500 text-sm">Location</h3>
          <p className="text-gray-700">{formData.location}</p>
        </div>
        
        <div>
          <h3 className="text-gray-500 text-sm">Supporting Documents</h3>
          {formData.files.length > 0 ? (
            <p className="text-gray-700">{formData.files.length} file(s) attached</p>
          ) : (
            <p className="text-gray-500">No files attached</p>
          )}
        </div>
      </div>
    </div>
  );
}
