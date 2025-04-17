
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import axios from "axios";
import { toast } from "sonner";

interface FormSubmitterProps {
  formData: any;
  setIsLoading: (loading: boolean) => void;
  setEstimationResults: (results: any) => void;
  nextStep: () => void;
  isMobile: boolean;
}

export function FormSubmitter({
  formData,
  setIsLoading,
  setEstimationResults,
  nextStep,
  isMobile,
}: FormSubmitterProps) {
  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Extract data for the more readable markdown format
    const correspondenceType = formData.subcategories?.correspondence?.type || "";
    const fullCorrespondenceType = getFullCorrespondenceType(correspondenceType);
    const clientName = formData.subcategories?.correspondence?.clientName || "";
    const date = formData.subcategories?.correspondence?.date || new Date().toLocaleDateString();
    
    // Format the description to include proper headers and content
    const createMarkdownDescription = () => {
      let markdownContent = "";
      
      // Add correspondence details
      markdownContent += "# Correspondence Details\n";
      markdownContent += `Type: ${fullCorrespondenceType}\n`;
      markdownContent += `Client: ${clientName}\n`;
      markdownContent += `Date: ${date}\n\n`;
      
      // Add project name if available
      if (formData.subcategories?.projectName?.content) {
        markdownContent += `# Project Name\n${formData.subcategories.projectName.content}\n\n`;
      }
      
      // Add project overview if available
      if (formData.subcategories?.overview?.content) {
        markdownContent += `# Project Overview\n${formData.subcategories.overview.content}\n\n`;
      }
      
      // Add dimensions if available
      if (formData.subcategories?.dimensions?.content) {
        markdownContent += `# Dimensions\n${formData.subcategories.dimensions.content}\n\n`;
      }
      
      // Add materials if available
      if (formData.subcategories?.materials?.content) {
        markdownContent += `# Materials\n${formData.subcategories.materials.content}\n\n`;
      }
      
      // Add finish and details if available
      if (formData.subcategories?.finish?.content) {
        markdownContent += `# Finish and Details\n${formData.subcategories.finish.content}\n\n`;
      }
      
      // Add location details if available
      if (formData.subcategories?.locationDetails?.content) {
        markdownContent += `# Location-Specific Details\n${formData.subcategories.locationDetails.content}\n\n`;
      }
      
      // Add timeframe if available
      if (formData.subcategories?.timeframe?.content) {
        markdownContent += `# Timeframe\n${formData.subcategories.timeframe.content}\n\n`;
      }
      
      // Add additional work if available
      if (formData.subcategories?.additionalWork?.content) {
        markdownContent += `# Additional Work\n${formData.subcategories.additionalWork.content}\n\n`;
      }
      
      // Add rates if available
      if (formData.subcategories?.rates?.content) {
        markdownContent += `# Hourly Rates\n${formData.subcategories.rates.content}\n\n`;
      }
      
      // Add margin if available
      if (formData.subcategories?.margin?.content) {
        markdownContent += `# Profit Margin\n${formData.subcategories.margin.content}\n\n`;
      }
      
      // Add notes if available
      if (formData.subcategories?.notes?.content) {
        markdownContent += `# Specific Notes and Terms\n${formData.subcategories.notes.content}\n\n`;
      }
      
      return markdownContent;
    };
    
    // Helper function to get full correspondence type
    function getFullCorrespondenceType(type: string) {
      switch (type.toLowerCase()) {
        case "accurate":
          return "Accurate Estimate";
        case "ballpark":
          return "Ballpark Estimate";
        case "quotation":
          return "Fixed Price Quotation";
        case "quote":
          return "Quotation";
        case "preliminary":
          return "Preliminary Estimate";
        case "proposal":
          return "Proposal";
        default:
          return type || "Estimate";
      }
    }
    
    try {
      // Create webhook data
      const webhookUrl = "https://hook.us2.make.com/niu1dp65y66kc2r3j56xdcl607sp8fyr";
      
      // Prepare data for the webhook
      const webhookData = {
        formData: {
          projectType: formData.projectType || "",
          location: formData.location || "",
          files: formData.files ? formData.files.length : 0,
          correspondence: {
            type: fullCorrespondenceType,
            clientName: clientName,
            date: date
          },
          subcategories: formData.subcategories || {}
        },
        timestamp: new Date().toISOString(),
      };
      
      console.log("Sending webhook data:", JSON.stringify(webhookData));
      
      // Send data to webhook - using axios for better error handling
      try {
        const response = await axios.post(webhookUrl, webhookData);
        console.log("Webhook response:", response);
        toast.success("Data sent to webhook successfully");
      } catch (error) {
        console.error("Error sending webhook data:", error);
        toast.error("Error sending data to webhook. Using fallback method.");
        
        // Fallback method using fetch with no-cors mode
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors",
            body: JSON.stringify(webhookData),
          });
          console.log("Webhook fallback method completed");
          toast.success("Data sent to webhook using fallback method");
        } catch (fallbackError) {
          console.error("Fallback webhook method failed:", fallbackError);
        }
      }
      
      // For development we will load a mock response
      // In a real application, this would be an API call to a service that generates the estimate
      
      setTimeout(() => {
        setEstimationResults({
          markdownContent: createMarkdownDescription()
        });
        
        setIsLoading(false);
        nextStep();
      }, 2000); // Simulate API call delay
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate estimate. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      className={`btn-next ${isMobile ? 'order-1' : ''}`}
    >
      Generate Estimate
    </button>
  );
}
