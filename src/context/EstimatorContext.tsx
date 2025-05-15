
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

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

  // Load form data from localStorage on component mount
  useEffect(() => {
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
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
      }}
    >
      {children}
    </EstimatorContext.Provider>
  );
};
