
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
      
      console.log("Sending data to webhook:", webhookUrl);
      console.log("Form data being sent:", {
        projectType: formData.projectType,
        description: formData.description,
        location: formData.location,
        subcategories: formData.subcategories,
        files: formData.files.map(f => f.name)
      });
      
      // Make the actual API call to the webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: data
      });
      
      console.log("Webhook response received", response);
      
      // Process the response
      if (response.ok) {
        try {
          // Get response as text first (since we don't know if it's JSON or Markdown)
          const textResponse = await response.text();
          console.log("Webhook raw response:", textResponse);
          
          if (!textResponse || textResponse.trim() === "") {
            throw new Error("Empty response received");
          }
          
          // Check if the response is valid JSON
          try {
            const jsonResponse = JSON.parse(textResponse);
            console.log("Successfully parsed response as JSON:", jsonResponse);
            
            if (jsonResponse.estimate) {
              // Standard JSON estimate format
              setEstimationResults({
                estimate: jsonResponse.estimate,
                markdownContent: null
              });
            } else {
              // JSON without expected structure, treat as markdown
              setEstimationResults({
                markdownContent: textResponse,
                estimate: null
              });
            }
          } catch (jsonError) {
            console.log("Response is not JSON, treating as markdown:", jsonError);
            // Not valid JSON, treat as markdown
            setEstimationResults({
              markdownContent: textResponse,
              estimate: null
            });
          }
          
          setIsLoading(false);
          nextStep();
          toast.success("Estimate generated successfully!");
        } catch (parseError) {
          console.error("Error processing response:", parseError);
          handleFallbackResponse();
        }
      } else {
        console.error(`Error status: ${response.status}, ${response.statusText}`);
        throw new Error(`Error status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      handleFallbackResponse();
    }
  };
  
  // Fallback response handler
  const handleFallbackResponse = () => {
    // Fallback to mock data if webhook fails
    const fallbackResponse = {
      estimate: {
        projectOverview: formData.description,
        scopeOfWork: "Based on your requirements",
        dimensions: "Standard dimensions",
        materials: {
          cost: 8500,
          breakdown: [
            { name: "Timber", cost: 2500 },
            { name: "Concrete", cost: 1800 },
            { name: "Fixtures", cost: 2200 },
            { name: "Other Materials", cost: 2000 }
          ]
        },
        labor: {
          hours: 120,
          cost: 6000
        },
        totalCost: 14500,
        timeline: "3 weeks",
        notes: "This is an initial estimate based on the provided information. A site visit is recommended for a more accurate quote.",
        materialDetails: "Standard quality materials included. Premium materials available at additional cost.",
        termsAndConditions: "Estimate valid for 30 days. 50% deposit required to begin work."
      },
      markdownContent: null
    };
    
    setEstimationResults(fallbackResponse);
    setIsLoading(false);
    nextStep();
    toast.warning("Using estimated values as we couldn't connect to our server. We'll follow up with an accurate quote.");
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
