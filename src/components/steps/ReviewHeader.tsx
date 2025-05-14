
import React from "react";
import EstimateHeader from "../estimate/EstimateHeader";

export const ReviewHeader = () => (
  <div className="text-center mb-8">
    <EstimateHeader />
    <p className="text-white/80 max-w-2xl mx-auto mt-2">
      Review your estimate and make any necessary changes before exporting
    </p>
  </div>
);
