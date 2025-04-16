import React from "react";
import { toast } from "sonner";

interface FormSubmitterProps {
  formData: any;
  setIsLoading: (value: boolean) => void;
  setEstimationResults: (value: any) => void;
  nextStep: () => void;
  isMobile: boolean;
}

export function FormSubmitter({ 
  formData, 
  setIsLoading, 
  setEstimationResults, 
  nextStep,
  isMobile
}: FormSubmitterProps) {
  const webhookUrl = "https://hook.us2.make.com/niu1dp65y66kc2r3j56xdcl607sp8fyr";
  
  const handleSubmit = async () => {
    const data = new FormData();
    data.append("projectType", formData.projectType || "");
    data.append("description", formData.description);
    data.append("location", formData.location);
    
    if (Object.keys(formData.subcategories).length > 0) {
      data.append("subcategories", JSON.stringify(formData.subcategories));
    }
    
    formData.files.forEach((file, index) => {
      data.append(`file-${index}`, file);
    });
    
    try {
      setIsLoading(true);
      
      console.log("Sending data to webhook:", webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: data
      });
      
      console.log("Webhook response status:", response.status);
      
      if (response.ok) {
        const textResponse = await response.text();
        console.log("Raw webhook response:", textResponse);
        
        try {
          // Try to parse as JSON array first
          const jsonResponse = JSON.parse(textResponse);
          
          // If it's an array with text objects, extract the markdown content
          if (Array.isArray(jsonResponse) && jsonResponse[0]?.text) {
            setEstimationResults({
              markdownContent: jsonResponse[0].text,
              estimate: null
            });
          } else {
            // If it's a different JSON structure, pass it as is
            setEstimationResults({
              markdownContent: textResponse,
              estimate: null
            });
          }
        } catch (jsonError) {
          // If not valid JSON, treat as plain markdown
          setEstimationResults({
            markdownContent: textResponse,
            estimate: null
          });
        }
        
        setIsLoading(false);
        nextStep();
        toast.success("Estimate generated successfully!");
      } else {
        throw new Error(`Error status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      handleFallbackResponse();
    }
  };
  
  const handleFallbackResponse = () => {
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
    <button
      onClick={handleSubmit}
      className={`btn-next ${isMobile ? 'order-1' : ''} ${isMobile ? 'w-full' : 'px-8'}`}
    >
      Generate Estimate
    </button>
  );
}
