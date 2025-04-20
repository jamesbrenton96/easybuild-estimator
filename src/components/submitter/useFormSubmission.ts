
import { useState } from "react";
import { useWebhookEstimate } from "./useWebhookEstimate";

interface UseFormSubmissionProps {
  formData: any;
  setIsLoading: (isLoading: boolean) => void;
  setEstimationResults: (results: any) => void;
  nextStep: () => void;
}

const useFormSubmission = ({
  formData,
  setIsLoading,
  setEstimationResults,
  nextStep,
}: UseFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "fail">("idle");

  const { getEstimate } = useWebhookEstimate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);
    setError(null);
    setStatus("idle");
    setUploadProgress(20);

    try {
      const estimateResult = await getEstimate(formData);
      setEstimationResults(estimateResult);
      setStatus("success");
      setUploadProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        nextStep();
      }, 600);
    } catch (err: any) {
      setError(err?.message || "An unknown error occurred.");
      setStatus("fail");
      setIsLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    uploadProgress,
    error,
    handleSubmit,
    status,
  };
};

export default useFormSubmission;
