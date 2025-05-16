
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import StepIndicator from "./StepIndicator";
import ProjectTypeStep from "./steps/ProjectTypeStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import DocumentsStep from "./steps/DocumentsStep";
import SubmitStep from "./steps/SubmitStep";
import ReviewStep from "./steps/ReviewStep";
import { Loader2, RefreshCcw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CostEstimator() {
  const { currentStep, isLoading, hasSavedData, loadSavedFormData, clearSavedFormData } = useEstimator();
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectTypeStep />;
      case 2:
        return <BasicInfoStep />;
      case 3:
        return <DocumentsStep />;
      case 4:
        return <SubmitStep />;
      case 5:
        return <ReviewStep />;
      default:
        return <ProjectTypeStep />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-construction-orange mb-6" />
          <h2 className="text-2xl font-medium mb-3">Processing your estimate</h2>
          <p className="text-white/70 text-center max-w-md">
            Our AI is analyzing your project details to generate an accurate cost estimate. This should only take a moment...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {hasSavedData && currentStep === 1 && (
        <div className="mb-8 max-w-2xl mx-auto">
          <Alert className="bg-construction-orange/20 border-construction-orange">
            <AlertCircle className="h-4 w-4 text-construction-orange" />
            <AlertDescription className="flex justify-between items-center">
              <span className="text-white">You have saved data from a previous session.</span>
              <div className="flex gap-2">
                <button 
                  onClick={loadSavedFormData}
                  className="flex items-center gap-1 bg-construction-orange text-white px-3 py-1 rounded text-xs hover:bg-construction-orange/90 transition-colors"
                >
                  <RefreshCcw className="h-3 w-3" /> Load Saved Data
                </button>
                <button 
                  onClick={clearSavedFormData}
                  className="flex items-center gap-1 bg-white/10 text-white px-3 py-1 rounded text-xs hover:bg-white/20 transition-colors"
                >
                  Clear
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <StepIndicator />
      {renderStep()}
    </div>
  );
}
