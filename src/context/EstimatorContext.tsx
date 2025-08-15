
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useStorageConsent } from "@/hooks/useStorageConsent";
import { StorageConsent } from "@/components/privacy/StorageConsent";

// Define types for our data structures
export interface ContentData {
  content: string;
}

export interface CorrespondenceData {
  type?: string;
  clientName?: string;
  date?: string;
  [key: string]: string | undefined;
}

interface EstimatorContextType {
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  formData: any;
  updateFormData: (data: any) => void;
  saveFormData: (data: any) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  estimationResults: any;
  setEstimationResults: (results: any) => void;
  showMaterialSources: boolean;
  setShowMaterialSources: (show: boolean) => void;
  hasSavedData: boolean;
  loadSavedFormData: () => void;
  clearSavedFormData: () => void;
}

const EstimatorContext = createContext<EstimatorContextType>({} as EstimatorContextType);

export const useEstimator = () => useContext(EstimatorContext);

export const EstimatorProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [estimationResults, setEstimationResults] = useState<any>(null);
  const [showMaterialSources, setShowMaterialSources] = useState<boolean>(true);
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  const [showConsentDialog, setShowConsentDialog] = useState<boolean>(false);
  
  const { hasConsent, isLoading: consentLoading, safeGetItem, safeSetItem, safeRemoveItem } = useStorageConsent();

  // Check for saved form data on component mount
  useEffect(() => {
    if (consentLoading || hasConsent === null) return;
    
    if (hasConsent === false) {
      setShowConsentDialog(true);
      return;
    }
    
    // First try to load regular form data
    const storedFormData = safeGetItem('formData');
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
    
    // Check if we have saved data from a failed generation
    const savedFormData = safeGetItem('savedFormData');
    if (savedFormData) {
      const timestamp = safeGetItem('formDataTimestamp');
      setHasSavedData(true);
      
      // Show notification about saved data if it exists
      if (timestamp) {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString();
        toast.info(
          `You have saved form data from ${formattedDate}. Click "Load Saved Data" to restore.`, 
          { duration: 8000 }
        );
      }
    }
  }, [hasConsent, consentLoading, safeGetItem]);

  // Load saved form data from localStorage
  const loadSavedFormData = useCallback(() => {
    if (!hasConsent) return;
    
    const savedFormData = safeGetItem('savedFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(parsedData);
      setCurrentStep(2); // Go to Basic Info step
      toast.success('Saved data has been loaded successfully', { duration: 3000 });
      setHasSavedData(false);
    }
  }, [hasConsent, safeGetItem]);

  // Clear saved form data
  const clearSavedFormData = useCallback(() => {
    if (!hasConsent) return;
    
    safeRemoveItem('savedFormData');
    safeRemoveItem('formDataTimestamp');
    setHasSavedData(false);
    toast.success('Saved data has been cleared', { duration: 3000 });
  }, [hasConsent, safeRemoveItem]);

  // Navigation functions
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Update form data in localStorage whenever it changes
  const updateFormData = useCallback((data: any) => {
    setFormData(prev => {
      const updatedFormData = { ...prev, ...data };
      if (hasConsent) {
        safeSetItem('formData', JSON.stringify(updatedFormData));
      }
      return updatedFormData;
    });
  }, [hasConsent, safeSetItem]);

  // Save form data to localStorage
  const saveFormData = (data: any) => {
    if (hasConsent) {
      safeSetItem('formData', JSON.stringify(data));
    }
  };

  const handleConsentResponse = (granted: boolean) => {
    setShowConsentDialog(false);
    if (!granted) {
      toast.info('Local storage disabled. Your progress won\'t be saved between sessions.', { duration: 5000 });
    }
  };

  return (
    <>
      <EstimatorContext.Provider
        value={{
          currentStep,
          setStep: setCurrentStep,
          nextStep,
          prevStep,
          formData,
          updateFormData,
          saveFormData,
          files,
          setFiles,
          isLoading,
          setIsLoading,
          estimationResults,
          setEstimationResults,
          showMaterialSources,
          setShowMaterialSources,
          hasSavedData,
          loadSavedFormData,
          clearSavedFormData,
        }}
      >
        {children}
      </EstimatorContext.Provider>
      
      {showConsentDialog && (
        <StorageConsent onConsent={handleConsentResponse} />
      )}
    </>
  );
};
