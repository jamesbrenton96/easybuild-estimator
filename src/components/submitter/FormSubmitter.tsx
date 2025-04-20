
import React from "react";
import useFormSubmission from "./useFormSubmission";
import { SubmitButton } from "./SubmitButton";
import { UploadProgress } from "./UploadProgress";
import { SubmissionStatus } from "./SubmissionStatus";

interface FormSubmitterProps {
  formData: any;
  setIsLoading: (isLoading: boolean) => void;
  setEstimationResults: (results: any) => void;
  nextStep: () => void;
  isMobile: boolean;
}

export const FormSubmitter: React.FC<FormSubmitterProps> = ({
  formData,
  setIsLoading,
  setEstimationResults,
  nextStep,
  isMobile,
}) => {
  const {
    isSubmitting,
    uploadProgress,
    error,
    handleSubmit,
    status,
  } = useFormSubmission({
    formData,
    setIsLoading,
    setEstimationResults,
    nextStep,
  });

  return (
    <div className={`w-full ${isMobile ? "" : "max-w-xs ml-auto"}`}>
      <form onSubmit={handleSubmit}>
        <SubmitButton isSubmitting={isSubmitting} />
        <UploadProgress progress={uploadProgress} />
        <SubmissionStatus error={error} status={status} />
      </form>
    </div>
  );
};
