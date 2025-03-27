
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SubmitStep() {
  const { formData, prevStep, nextStep, setIsLoading, setEstimationResults } = useEstimator();
  const isMobile = useIsMobile();
  
  const handleSubmit = async () => {
    // Create a placeholder for the Make.com webhook URL
    const webhookUrl = "https://hook.make.com/YOUR_WEBHOOK_ID"; // This would be replaced with the actual webhook URL
    
    // Create FormData for file uploads
    const data = new FormData();
    data.append("projectType", formData.projectType || "");
    data.append("description", formData.description);
    data.append("location", formData.location);
    
    // Append files if any
    formData.files.forEach((file, index) => {
      data.append(`file-${index}`, file);
    });
    
    try {
      setIsLoading(true);
      
      // In a real implementation, send the data to the webhook
      // For now, we'll simulate a response after a delay
      setTimeout(() => {
        // This is a placeholder for the response from the AI estimation service
        const mockResponse = {
          estimate: {
            labor: {
              hours: 120,
              cost: 6000
            },
            materials: {
              cost: 8500,
              breakdown: [
                { name: "Timber", cost: 2500 },
                { name: "Concrete", cost: 1800 },
                { name: "Fixtures", cost: 2200 },
                { name: "Other Materials", cost: 2000 }
              ]
            },
            totalCost: 14500,
            timeline: "3 weeks",
            notes: "This is an initial estimate based on the provided information. A site visit is recommended for a more accurate quote."
          }
        };
        
        setEstimationResults(mockResponse);
        setIsLoading(false);
        nextStep();
      }, 3000);
      
      // If you want to implement the actual API call, uncomment the following code and adjust accordingly:
      /*
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: data,
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit data");
      }
      
      const result = await response.json();
      setEstimationResults(result);
      setIsLoading(false);
      nextStep();
      */
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to generate estimate. Please try again.");
      console.error("Error submitting form:", error);
    }
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
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white/70 text-sm">Project Type</h3>
              <p className="text-white font-medium">{formData.projectType}</p>
            </div>
            
            <div>
              <h3 className="text-white/70 text-sm">Description</h3>
              <p className="text-white">{formData.description}</p>
            </div>
            
            <div>
              <h3 className="text-white/70 text-sm">Location</h3>
              <p className="text-white">{formData.location}</p>
            </div>
            
            <div>
              <h3 className="text-white/70 text-sm">Supporting Documents</h3>
              {formData.files.length > 0 ? (
                <p className="text-white">{formData.files.length} file(s) attached</p>
              ) : (
                <p className="text-white/50">No files attached</p>
              )}
            </div>
          </div>
        </div>
        
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
          
          <button
            onClick={handleSubmit}
            className={`btn-next ${isMobile ? 'order-1' : ''} ${isMobile ? 'w-full' : 'px-8'}`}
          >
            Generate Estimate
          </button>
        </div>
      </div>
    </motion.div>
  );
}
