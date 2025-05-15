
import React from "react";
import ReviewDetails from "./ReviewDetails";

export const ReviewDetailsCard: React.FC<{ formData: any }> = ({ formData }) => (
  <div className="mb-8">
    <ReviewDetails formData={formData} />
  </div>
);
