
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { toast } from "sonner";

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

  // Check for saved form data on component mount
  useEffect(() => {
    // First try to load regular form data
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
    
    // Check if we have saved data from a failed generation
    const savedFormData = localStorage.getItem('savedFormData');
    if (savedFormData) {
      const timestamp = localStorage.getItem('formDataTimestamp');
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
  }, []);

  // Load saved form data from localStorage
  const loadSavedFormData = useCallback(() => {
    const savedFormData = localStorage.getItem('savedFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(parsedData);
      setCurrentStep(2); // Go to Basic Info step
      toast.success('Saved data has been loaded successfully', { duration: 3000 });
      setHasSavedData(false);
    }
  }, []);

  // Clear saved form data
  const clearSavedFormData = useCallback(() => {
    localStorage.removeItem('savedFormData');
    localStorage.removeItem('formDataTimestamp');
    setHasSavedData(false);
    toast.success('Saved data has been cleared', { duration: 3000 });
  }, []);

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
      localStorage.setItem('formData', JSON.stringify(updatedFormData));
      return updatedFormData;
    });
  }, []);

  // Save form data to localStorage
  const saveFormData = (data: any) => {
    localStorage.setItem('formData', JSON.stringify(data));
  };

  return (
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
  );
};
