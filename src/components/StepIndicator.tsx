
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
    <div className="mb-12">
      <div className="hidden sm:flex justify-center items-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {index > 0 && (
              <div
                className={cn(
                  "step-line w-16 md:w-24 lg:w-32",
                  currentStep >= step.number && "step-line-active"
                )}
              />
            )}
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ 
                scale: currentStep === step.number ? 1.1 : 1,
                opacity: currentStep >= step.number ? 1 : 0.7 
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep === step.number
                    ? "bg-construction-orange text-white ring-2 ring-offset-2 ring-construction-orange"
                    : currentStep > step.number
                    ? "bg-construction-orange text-white"
                    : "bg-white/20 text-white"
                )}
              >
                {currentStep > step.number ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={cn(
                "absolute -bottom-8 text-sm whitespace-nowrap px-2",
                currentStep === step.number ? "text-construction-orange font-medium" : "text-white/70"
              )}>
                {step.label}
              </span>
            </motion.div>
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile stepper (dots only) */}
      <div className="flex sm:hidden justify-center items-center space-x-3 mb-6">
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
