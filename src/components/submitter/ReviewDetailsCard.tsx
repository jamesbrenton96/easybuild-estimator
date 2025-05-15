
import React from "react";
import ReviewDetails from "./ReviewDetails";
import { useEstimator } from "@/context/EstimatorContext";

export const ReviewDetailsCard: React.FC<{ formData: any }> = ({ formData }) => {
  const { showMaterialBreakdown } = useEstimator();
  
  return (
    <div className="mb-8">
      <ReviewDetails 
        formData={formData} 
        showMaterialBreakdown={showMaterialBreakdown}
      />
    </div>
  );
};
