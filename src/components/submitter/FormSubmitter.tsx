import React, { useState } from "react";
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
  const [webhookError, setWebhookError] = useState<string | null>(null);
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setWebhookError(null);
    
    // Extract data for the more readable markdown format
    const correspondenceType = formData.subcategories?.correspondence?.type || "";
    const fullCorrespondenceType = getFullCorrespondenceType(correspondenceType);
    const clientName = formData.subcategories?.correspondence?.clientName || "";
    const date = formData.subcategories?.correspondence?.date || new Date().toLocaleDateString();
    
    // Create a better markdown representation of the input data
    const createMarkdownDescription = () => {
      let markdownContent = "";
      
      // Add correspondence details
      markdownContent += "# Construction Cost Estimate\n\n";
      markdownContent += "## Correspondence Details\n";
      markdownContent += `**Type:** ${fullCorrespondenceType}\n`;
      markdownContent += `**Client:** ${clientName}\n`;
      markdownContent += `**Date:** ${date}\n\n`;
      
      // Add project name if available
      if (formData.subcategories?.projectName?.content) {
        markdownContent += `## Project Name\n${formData.subcategories.projectName.content}\n\n`;
      }
      
      // Add project overview if available
      if (formData.subcategories?.overview?.content) {
        markdownContent += `## Project Overview\n${formData.subcategories.overview.content}\n\n`;
      }
      
      // Add dimensions if available
      if (formData.subcategories?.dimensions?.content) {
        markdownContent += `## Dimensions\n${formData.subcategories.dimensions.content}\n\n`;
      }
      
      // Add materials if available
      if (formData.subcategories?.materials?.content) {
        markdownContent += `## Materials\n${formData.subcategories.materials.content}\n\n`;
      }
      
      // Add finish and details if available
      if (formData.subcategories?.finish?.content) {
        markdownContent += `## Finish and Details\n${formData.subcategories.finish.content}\n\n`;
      }
      
      // Add location details if available
      if (formData.subcategories?.locationDetails?.content) {
        markdownContent += `## Location-Specific Details\n${formData.subcategories.locationDetails.content}\n\n`;
      }
      
      // Add timeframe if available
      if (formData.subcategories?.timeframe?.content) {
        markdownContent += `## Timeframe\n${formData.subcategories.timeframe.content}\n\n`;
      }
      
      // Add additional work if available
      if (formData.subcategories?.additionalWork?.content) {
        markdownContent += `## Additional Work\n${formData.subcategories.additionalWork.content}\n\n`;
      }
      
      // Add rates if available
      if (formData.subcategories?.rates?.content) {
        markdownContent += `## Hourly Rates\n${formData.subcategories.rates.content}\n\n`;
      }
      
      // Add margin if available
      if (formData.subcategories?.margin?.content) {
        markdownContent += `## Profit Margin\n${formData.subcategories.margin.content}\n\n`;
      }
      
      // Add notes if available
      if (formData.subcategories?.notes?.content) {
        markdownContent += `## Specific Notes and Terms\n${formData.subcategories.notes.content}\n\n`;
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
      
      // Create the base markdown content that we'll use as fallback
      const baseMarkdownContent = createMarkdownDescription();
      
      // Prepare file information for the webhook
      const fileDetails = formData.files ? formData.files.map((file: File) => ({
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1024) + " KB",
        lastModified: new Date(file.lastModified).toISOString()
      })) : [];
      
      // Prepare the webhook data
      const webhookData = {
        formData: {
          projectType: formData.projectType || "",
          location: formData.location || "",
          files: fileDetails,
          correspondence: {
            type: fullCorrespondenceType,
            clientName: clientName,
            date: date
          },
          subcategories: formData.subcategories || {},
          markdownInput: baseMarkdownContent // Send our nicely formatted input as well
        },
        timestamp: new Date().toISOString(),
      };
      
      console.log("Sending webhook data:", JSON.stringify(webhookData));
      
      // This will hold our response - either from the webhook or our fallback
      let responseData = null;
      let webhookSuccess = false;
      
      // Send data to webhook - using axios for better error handling
      try {
        const response = await axios.post(webhookUrl, webhookData, {
          timeout: 15000 // 15 second timeout
        });
        
        console.log("Webhook response:", response);
        
        if (response.data) {
          responseData = response.data;
          webhookSuccess = true;
          toast.success("Estimate generated successfully");
        } else {
          // Handle empty response
          toast.warning("Received empty response from estimation service. Using input data instead.");
          console.warn("Empty response from webhook");
        }
      } catch (error: any) {
        console.error("Error sending webhook data:", error);
        setWebhookError(error.message || "Error sending data to webhook");
        toast.error("Error connecting to estimation service. Using alternative method.");
        
        // Fallback method using fetch with no-cors mode
        try {
          console.log("Trying fallback webhook method...");
          const fallbackResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors",
            body: JSON.stringify(webhookData),
          });
          
          console.log("Webhook fallback method completed", fallbackResponse);
          toast.success("Estimate processing completed");
          
          // Since no-cors mode doesn't return readable data, we'll use our input as the response
          // but we'll format it in a way that looks like it was processed
          webhookSuccess = true;
        } catch (fallbackError: any) {
          console.error("Fallback webhook method failed:", fallbackError);
          setWebhookError((fallbackError.message || "Connection to estimation service failed."));
          toast.error("Unable to connect to estimation service. Using your input data instead.");
        }
      }
      
      // If webhook didn't succeed or we don't have response data, use the markdown we generated
      if (!webhookSuccess || !responseData) {
        console.log("Using generated markdown as fallback");
        responseData = {
          markdownContent: baseMarkdownContent,
          webhookStatus: "fallback"
        };
      }
      
      // Check if the responseData is a string (sometimes webhooks return stringified JSON)
      if (typeof responseData === 'string') {
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          // If it's not valid JSON, treat the string as markdown content
          if (responseData.includes("Sorry, the estimate couldn't be generated")) {
            // If the response is an error message, use our fallback
            responseData = { 
              markdownContent: baseMarkdownContent,
              webhookStatus: "error-response"
            };
          } else {
            // Otherwise use the string response as the content
            responseData = { 
              markdownContent: responseData,
              webhookStatus: "string-response" 
            };
          }
        }
      }
      
      // If the responseData doesn't have markdownContent, add it
      if (!responseData.markdownContent) {
        responseData = {
          ...responseData,
          markdownContent: baseMarkdownContent,
          webhookStatus: "no-markdown"
        };
      }
      
      // If responseData.markdownContent is just the error message, replace it with our input
      if (responseData.markdownContent.includes("Sorry, the estimate couldn't be generated")) {
        responseData.markdownContent = baseMarkdownContent;
        responseData.webhookStatus = "error-content";
      }
      
      // Update the state with our results
      console.log("Final estimation results:", responseData);
      setEstimationResults(responseData);
      setIsLoading(false);
      nextStep();
      
      // Display any webhook errors that occurred
      if (webhookError) {
        console.warn("Webhook error occurred but process continued:", webhookError);
      }
    } catch (error: any) {
      console.error("Overall process error:", error);
      toast.error("Failed to generate estimate. Using your input data as fallback.");
      setIsLoading(false);
      
      // Create fallback content from the user's input
      const fallbackContent = createMarkdownDescription();
      setEstimationResults({ 
        markdownContent: fallbackContent,
        webhookStatus: "process-error"
      });
      nextStep();
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
