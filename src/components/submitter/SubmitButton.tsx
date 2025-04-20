
import React from "react";

export const SubmitButton: React.FC<{ isSubmitting: boolean }> = ({
  isSubmitting,
}) => (
  <button
    type="submit"
    className="bg-construction-orange w-full text-white py-3 rounded-md font-medium hover:bg-construction-orange/90 transition-all mb-2"
    disabled={isSubmitting}
  >
    {isSubmitting ? "Generating Estimate..." : "Generate Estimate"}
  </button>
);
