
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for our context
interface EstimatorContextType {
  currentStep: number;
  formData: FormData;
  isLoading: boolean;
  estimationResults: EstimationResults | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<FormData>) => void;
  setIsLoading: (loading: boolean) => void;
  setEstimationResults: (results: EstimationResults | null) => void;
  saveFormData: (data: FormData) => void;
  getSavedFormData: () => FormData | null;
}

// Types for our form data
export interface FormData {
  projectType?: string;
  description?: string;
  location?: string;
  files?: File[];
  subcategories?: SubcategoryData;
  [key: string]: any;
}

export interface ContentData {
  content: string;
}

export interface CorrespondenceData {
  type?: string;
  clientName?: string;
  date?: string;
  [key: string]: string | undefined;
}

export interface SubcategoryData {
  correspondence: CorrespondenceData;
  projectName: ContentData;
  overview: ContentData;
  dimensions: ContentData;
  materials: ContentData;
  finish: ContentData;
  locationDetails: ContentData;
  timeframe: ContentData;
  additionalWork: ContentData;
  rates: ContentData;
  margin: ContentData;
  notes: ContentData;
  [key: string]: ContentData | CorrespondenceData;
}

// Types for the estimation results
export interface EstimationResults {
  markdownContent?: string;
  estimate?: any;
  [key: string]: any;
}

// Create the context with default values
const EstimatorContext = createContext<EstimatorContextType>({
  currentStep: 1,
  formData: {},
  isLoading: false,
  estimationResults: null,
  setStep: () => {},
  nextStep: () => {},
  prevStep: () => {},
  updateFormData: () => {},
  setIsLoading: () => {},
  setEstimationResults: () => {},
  saveFormData: () => {},
  getSavedFormData: () => null,
});

// Create a provider component
export function EstimatorProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [estimationResults, setEstimationResults] = useState<EstimationResults | null>(null);
  
  // Check localStorage for saved form data on initial load
  const initialFormData = localStorage.getItem('savedFormData') ? 
    JSON.parse(localStorage.getItem('savedFormData') || '{}') : 
    {
      files: [],
      subcategories: {
        correspondence: {},
        projectName: { content: "" },
        overview: { content: "" },
        dimensions: { content: "" },
        materials: { content: "" },
        finish: { content: "" },
        locationDetails: { content: "" },
        timeframe: { content: "" },
        additionalWork: { content: "" },
        rates: { content: "" },
        margin: { content: "" },
        notes: { content: "" }
      }
    };
  
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const setStep = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Save form data to localStorage
  const saveFormData = (data: FormData) => {
    localStorage.setItem('savedFormData', JSON.stringify(data));
  };
  
  // Get saved form data from localStorage
  const getSavedFormData = (): FormData | null => {
    const savedData = localStorage.getItem('savedFormData');
    return savedData ? JSON.parse(savedData) : null;
  };

  return (
    <EstimatorContext.Provider
      value={{
        currentStep,
        formData,
        isLoading,
        estimationResults,
        setStep,
        nextStep,
        prevStep,
        updateFormData,
        setIsLoading,
        setEstimationResults,
        saveFormData,
        getSavedFormData,
      }}
    >
      {children}
    </EstimatorContext.Provider>
  );
}

// Custom hook to use the estimator context
export function useEstimator() {
  const context = useContext(EstimatorContext);
  if (!context) {
    throw new Error('useEstimator must be used within an EstimatorProvider');
  }
  return context;
}
