
import { useState } from "react";
import { useWebhookEstimate } from "./useWebhookEstimate";
import { toast } from "@/hooks/use-toast";

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

  const validateFiles = (files: File[]): { valid: boolean; message?: string } => {
    // Check for empty files array
    if (!Array.isArray(files) || files.length === 0) {
      return { valid: true }; // Files are optional
    }

    const isFilePDF = (file: File) => file.type === "application/pdf";
    const isFileJPEG = (file: File) => ["image/jpeg", "image/jpg"].includes(file.type);
    
    const pdfFiles = files.filter(isFilePDF);
    const jpegFiles = files.filter(isFileJPEG);
    const otherFiles = files.filter(file => !isFilePDF(file) && !isFileJPEG(file));
    
    if (otherFiles.length > 0) {
      return { valid: false, message: "Only JPEG and PDF files are allowed." };
    }
    
    if (pdfFiles.length > 0 && jpegFiles.length > 0) {
      return { valid: false, message: "You can upload either JPEG files OR a PDF file, not both." };
    }
    
    if (pdfFiles.length > 1) {
      return { valid: false, message: "You can upload a maximum of 1 PDF file." };
    }
    
    if (jpegFiles.length > 4) {
      return { valid: false, message: "You can upload a maximum of 4 JPEG files." };
    }
    
    return { valid: true };
  };

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
      
      // Validate files
      if (Array.isArray(submissionData.files) && submissionData.files.length > 0) {
        const fileValidation = validateFiles(submissionData.files);
        if (!fileValidation.valid) {
          throw new Error(fileValidation.message);
        }
        
        setUploadProgress(30);
        
        // Log file information for debugging
        console.log(`Processing ${submissionData.files.length} files`);
        submissionData.files.forEach((file: File, index: number) => {
          console.log(`File ${index + 1}: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);
        });
        
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
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "An unknown error occurred while submitting your estimate."
      });
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
