
import React from "react";
import { FormSubmitter } from "../submitter/FormSubmitter";

export const SubmitActions = ({
  prevStep,
  formData,
  setIsLoading,
  setEstimationResults,
  nextStep,
  isMobile,
}: {
  prevStep: () => void;
  formData: any;
  setIsLoading: (b: boolean) => void;
  setEstimationResults: (r: any) => void;
  nextStep: () => void;
  isMobile: boolean;
}) => (
  <div className={`flex ${isMobile ? "flex-col space-y-4" : "justify-between"}`}>
    <button
      onClick={prevStep}
      className={`btn-back ${isMobile ? "order-2" : ""}`}
    >
      Back
    </button>
    <FormSubmitter
      formData={formData}
      setIsLoading={setIsLoading}
      setEstimationResults={setEstimationResults}
      nextStep={nextStep}
      isMobile={isMobile}
    />
  </div>
);
