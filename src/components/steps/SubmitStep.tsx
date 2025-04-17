
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormSubmitter } from "../submitter/FormSubmitter";
import ReviewDetails from "../submitter/ReviewDetails";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SubmitStep() {
  const { formData, prevStep, nextStep, setIsLoading, setEstimationResults } = useEstimator();
  const isMobile = useIsMobile();
  
  // Format the description for better readability
  const formatDescription = (description: string) => {
    if (!description) return "";
    
    // Replace single newlines with two newlines for better readability
    return description
      .split('\n')
      .map(line => {
        // Add extra formatting for headers to make them stand out
        if (line.startsWith('# ')) {
          return `\n${line}`;
        }
        return line;
      })
      .join('\n');
  };
  
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
        
        <Card className="mb-8 bg-white/5 border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-2">Project Details (Markdown Format)</h3>
            <ScrollArea className="h-[250px] rounded-md border border-white/20 bg-white/10 p-4">
              <pre className="text-white/90 font-mono text-xs whitespace-pre-wrap">
                {formatDescription(formData.description || "")}
              </pre>
            </ScrollArea>
            <p className="text-white/70 text-xs mt-2">
              This is how your project details will be sent to our AI estimator. You can edit this content in the review step.
            </p>
          </CardContent>
        </Card>
        
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
