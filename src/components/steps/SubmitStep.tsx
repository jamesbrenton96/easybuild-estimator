
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SubmitStep() {
  const { formData, prevStep, nextStep, setIsLoading, setEstimationResults } = useEstimator();
  const isMobile = useIsMobile();
  // Use the provided webhook URL directly
  const webhookUrl = "https://hook.us2.make.com/niu1dp65y66kc2r3j56xdcl607sp8fyr";
  
  const handleSubmit = async () => {
    // Create FormData for file uploads
    const data = new FormData();
    data.append("projectType", formData.projectType || "");
    data.append("description", formData.description);
    data.append("location", formData.location);
    
    // Add subcategories if any
    if (Object.keys(formData.subcategories).length > 0) {
      data.append("subcategories", JSON.stringify(formData.subcategories));
    }
    
    // Append files if any
    formData.files.forEach((file, index) => {
      data.append(`file-${index}`, file);
    });
    
    try {
      setIsLoading(true);
      
      // In a real implementation, this would send data to Make.com
      console.log("Sending data to webhook:", webhookUrl);
      
      // For now we'll use the mock response while users set up their Make.com scenario
      setTimeout(() => {
        // Mock response that would normally come from Make.com
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
      
      // When ready to integrate with Make.com, uncomment this code
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
