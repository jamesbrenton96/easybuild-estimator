
import React, { createContext, useContext, useState } from "react";

export type ProjectType = 
  | "All Trades Included"
  | "House Extension"
  | "House Renovation"
  | "New Build"
  | "Deck / Landscaping"
  | "Electrical"
  | "Plumbing"
  | "Concreting"
  | "Carpentry / Framing"
  | "Roofing"
  | "Painting & Decorating"
  | "Tiling"
  | "Plastering / Gib Stopping"
  | "Bricklaying / Blockwork"
  | "Earthworks / Excavation"
  | "Drainage"
  | "HVAC"
  | "Insulation"
  | "Flooring"
  | "Windows & Glazing"
  | "Cabinetry / Joinery"
  | "Welding / Metalwork"
  | "Fencing / Gates"
  | "Demolition"
  | "Scaffolding"
  | "Waterproofing"
  | "Solar Installation"
  | "Smart Home / Automation"
  | "Site Prep & Cleanup";

type FormDataType = {
  projectType: ProjectType | null;
  description: string;
  location: string;
  files: File[];
};

type EstimatorContextProps = {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  formData: FormDataType;
  updateFormData: (data: Partial<FormDataType>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  estimationResults: any | null;
  setEstimationResults: (results: any) => void;
};

const defaultFormData: FormDataType = {
  projectType: null,
  description: "",
  location: "",
  files: [],
};

const defaultContextValue: EstimatorContextProps = {
  currentStep: 1,
  nextStep: () => {},
  prevStep: () => {},
  setStep: () => {},
  formData: defaultFormData,
  updateFormData: () => {},
  isLoading: false,
  setIsLoading: () => {},
  estimationResults: null,
  setEstimationResults: () => {},
};

const EstimatorContext = createContext<EstimatorContextProps>(defaultContextValue);

export const useEstimator = () => useContext(EstimatorContext);

export const EstimatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [estimationResults, setEstimationResults] = useState<any | null>(null);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const setStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  const updateFormData = (data: Partial<FormDataType>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const value = {
    currentStep,
    nextStep,
    prevStep,
    setStep,
    formData,
    updateFormData,
    isLoading,
    setIsLoading,
    estimationResults,
    setEstimationResults,
  };

  return <EstimatorContext.Provider value={value}>{children}</EstimatorContext.Provider>;
};
