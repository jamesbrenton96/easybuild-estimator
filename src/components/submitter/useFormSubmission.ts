
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
      // Create a copy of the form data
      const submissionData = { ...formData };
      
      // Validate and prepare files array
      if (Array.isArray(submissionData.files) && submissionData.files.length > 0) {
        setUploadProgress(30);
        
        // Ensure we only have valid file objects
        const validFiles = submissionData.files.filter(
          (file: File) => file && file instanceof File && file.name && file.size > 0
        );
        
        // Log file information for debugging
        console.log(`Processing ${validFiles.length} valid files for submission`);
        validFiles.forEach((file: File, index: number) => {
          console.log(`File ${index + 1}: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);
        });
        
        // Replace the files in submission data with validated files
        submissionData.files = validFiles;
        
        setUploadProgress(60);
      } else {
        // Ensure files is at least an empty array
        submissionData.files = [];
      }

      // Call the API with the prepared data
      const estimateResult = await getEstimate(submissionData);
      setEstimationResults(estimateResult);
      setStatus("success");
      setUploadProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        nextStep();
      }, 600);
    } catch (err: any) {
      console.error("Submission error:", err);
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
