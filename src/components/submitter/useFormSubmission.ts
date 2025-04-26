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
      
      // Keep files in the files array, but process them for transmission
      if (Array.isArray(submissionData.files) && submissionData.files.length > 0) {
        setUploadProgress(30);
        const processedFiles = await Promise.all(
          submissionData.files.map(async (file: File) => {
            try {
              const base64Data = await fileToBase64(file);
              return {
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64Data,
                extension: file.name.split('.').pop()?.toLowerCase() || '',
                isPDF: file.type === 'application/pdf'
              };
            } catch (err) {
              console.error("Error converting file to base64:", err);
              return null;
            }
          })
        );
        
        // Keep the original files array and add processed data
        submissionData.files = submissionData.files.map((file: File, index: number) => ({
          ...file,
          processedData: processedFiles[index]
        }));
        
        console.log(`Processing ${submissionData.files.length} files`);
        console.log("File types:", submissionData.files.map((f: any) => f.type));
        
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
