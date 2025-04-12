
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormSubmitter } from "../submitter/FormSubmitter";
import ReviewDetails from "../submitter/ReviewDetails";

export default function SubmitStep() {
  const { formData, prevStep, nextStep, setIsLoading, setEstimationResults } = useEstimator();
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Generate Your Estimate</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Please review your information before submitting.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <ReviewDetails formData={formData} />
        
        <div className="text-center text-white/80 text-sm mb-8">
          By submitting, our AI will analyze your project details and generate an estimate.
        </div>
        
        <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between'}`}>
          <button
            onClick={prevStep}
            className={`btn-back ${isMobile ? 'order-2' : ''}`}
          >
            Back
          </button>
          
          <FormSubmitter 
            formData={formData}
            setIsLoading={setIsLoading}
            setEstimationResults={setEstimationResults}
            nextStep={nextStep}
            isMobile={isMobile}
          />
        </div>
      </div>
    </motion.div>
  );
}
