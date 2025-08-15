import { useState } from "react";
import { useSupabaseSubmission } from "@/hooks/useSupabaseSubmission";
import { useStorageConsent } from "@/hooks/useStorageConsent";
import { toast } from "sonner";

interface UseFormSubmissionProps {
  formData: any;
  setIsLoading: (isLoading: boolean) => void;
  setEstimationResults: (results: any) => void;
  nextStep: () => void;
}

export default function useFormSubmission({
  formData,
  setIsLoading,
  setEstimationResults,
  nextStep,
}: UseFormSubmissionProps) {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "fail">("idle");

  const { 
    isSubmitting, 
    uploadProgress, 
    submitProjectData 
  } = useSupabaseSubmission();
  
  const { hasConsent, safeSetItem } = useStorageConsent();

  // Function to save form data to localStorage
  const saveFormDataToStorage = (data: any) => {
    if (!hasConsent) {
      console.log("Storage consent not granted, skipping form data save");
      return;
    }
    
    try {
      // Create a copy without file objects (they can't be serialized)
      const saveData = { ...data };
      if (saveData.files) {
        delete saveData.files;
      }
      safeSetItem('savedFormData', JSON.stringify(saveData));
      safeSetItem('formDataTimestamp', new Date().toISOString());
    } catch (err) {
      console.error("Error saving form data to localStorage:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData || typeof formData !== "object") {
      setError("Invalid form data");
      return;
    }

    setError(null);
    setStatus("idle");
    setIsLoading(true);

    try {
      // Map form data to submission format
      const submissionData = {
        projectName: formData.projectName,
        projectType: formData.projectType,
        description: formData.description,
        locationDetails: formData.locationDetails,
        dimensions: formData.dimensions,
        materials: formData.materials,
        finishDetails: formData.finishDetails,
        timeframe: formData.timeframe,
        rates: formData.rates,
        margin: formData.margin,
        additionalWork: formData.additionalWork,
        notes: formData.notes,
        correspondence: formData.correspondence,
        files: formData.files || []
      };

      const result = await submitProjectData(submissionData);
      
      setStatus("success");

      setEstimationResults({
        markdownContent: result.markdownContent,
        submissionId: result.submissionId,
        estimateId: result.estimateId,
        processingTime: result.processingTime
      });

      toast.success("Estimate generated successfully!");
      nextStep();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Submission error:", error);
      setError(errorMessage);
      setStatus("fail");
      toast.error(`Failed to generate estimate: ${errorMessage}`);
      
      // Save form data to storage on error
      saveFormDataToStorage(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSubmitting,
    uploadProgress,
    error,
    handleSubmit,
    status,
  };
}