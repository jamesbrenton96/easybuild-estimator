
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function StepIndicator() {
  const { currentStep } = useEstimator();
  
  const steps = [
    { number: 1, label: "Project Type" },
    { number: 2, label: "Basic Information" },
    { number: 3, label: "Documents" },
    { number: 4, label: "Submit" },
    { number: 5, label: "Review" },
  ];

  return (
    <div className="mb-8">
      <div className="hidden sm:flex justify-center items-center space-x-2 mb-1">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {index > 0 && (
              <div
                className={cn(
                  "step-line",
                  currentStep >= step.number && "step-line-active"
                )}
              />
            )}
            <motion.div
              className="relative"
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ 
                scale: currentStep === step.number ? 1.1 : 1,
                opacity: currentStep >= step.number ? 1 : 0.7 
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                  currentStep === step.number
                    ? "bg-construction-orange text-white ring-2 ring-offset-2 ring-construction-orange"
                    : currentStep > step.number
                    ? "bg-construction-orange text-white"
                    : "bg-white/20 text-white"
                )}
              >
                {currentStep > step.number ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={cn(
                "absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap",
                currentStep === step.number ? "text-construction-orange font-medium" : "text-white/70"
              )}>
                {step.label}
              </span>
            </motion.div>
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile stepper (dots only) */}
      <div className="flex sm:hidden justify-center items-center space-x-2 mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {index > 0 && (
              <div
                className={cn(
                  "step-line",
                  currentStep >= step.number && "step-line-active"
                )}
              />
            )}
            <div
              className={cn(
                "step-dot",
                currentStep >= step.number && "step-dot-active"
              )}
            />
          </React.Fragment>
        ))}
      </div>
      
      {/* Current step description - mobile only */}
      <div className="sm:hidden text-center">
        <h2 className="text-white text-lg font-medium">
          Step {currentStep}: {steps.find(step => step.number === currentStep)?.label}
        </h2>
      </div>
    </div>
  );
}
