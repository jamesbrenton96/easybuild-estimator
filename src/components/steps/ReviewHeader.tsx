
import React from "react";
import EstimateHeader from "../estimate/EstimateHeader";

export const ReviewHeader = () => (
  <div className="text-center mb-8">
    <img 
      src="/lovable-uploads/54be63ea-83fd-4f4a-8c94-dba12936b674.png" 
      alt="Brenton Building" 
      className="h-24 mx-auto mb-6" // Increased size from default
    />
    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your Estimate is Ready</h1>
    <p className="text-white/80 max-w-2xl mx-auto">
      Review your construction estimate and make any necessary adjustments before finalizing.
    </p>
  </div>
);
