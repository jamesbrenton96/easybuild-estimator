
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
      // Prepare form data for submission with files
      const submissionData = { ...formData };
      
      // Process files if they exist
      if (Array.isArray(submissionData.files) && submissionData.files.length > 0) {
        // Convert files to base64 for transmission
        setUploadProgress(30);
        const processedFiles = await Promise.all(
          submissionData.files.map(async (file: File) => {
            try {
              // For each file, convert to base64
              const base64Data = await fileToBase64(file);
              return {
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64Data,
                // Add filename extension explicitly to help the webhook identify file type
                extension: file.name.split('.').pop()?.toLowerCase() || '',
                isPDF: file.type === 'application/pdf'
              };
            } catch (err) {
              console.error("Error converting file to base64:", err);
              return null;
            }
          })
        );
        
        // Filter out any nulls from failed conversions
        submissionData.processedFiles = processedFiles.filter(Boolean);
        
        // Log files being sent for debugging
        console.log(`Sending ${submissionData.processedFiles.length} files to webhook`);
        console.log("File types:", submissionData.processedFiles.map((f: any) => f.type));
        
        setUploadProgress(60);
      }

      const estimateResult = await getEstimate(submissionData);
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

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
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
