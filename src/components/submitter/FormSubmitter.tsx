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
        requestId: Math.random().toString(36).substring(2, 15)
      };
      
      console.log("Sending webhook data:", JSON.stringify(webhookData));
      
      // This will hold our response - either from the webhook or our fallback
      let responseData = null;
      let webhookSuccess = false;
      let rawResponse = null;
      
      try {
        // First attempt with proper axios request
        const response = await axios.post(webhookUrl, webhookData, {
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Cache-Control': 'no-cache, no-store',
            'Pragma': 'no-cache'
          }
        });
        
        // Log the entire raw response for debugging
        rawResponse = response.data;
        console.log("RAW Make.com Response:", JSON.stringify(rawResponse));
        
        // Log additional debug information about the response structure
        console.log("Response debug info:", {
          hasData: !!response.data,
          dataType: typeof response.data,
          isString: typeof response.data === 'string',
          isObject: typeof response.data === 'object',
          hasTextLong: typeof response.data === 'object' && 'textLong' in response.data,
          hasMarkdownContent: typeof response.data === 'object' && 'markdownContent' in response.data,
          keyNames: typeof response.data === 'object' ? Object.keys(response.data) : 'N/A',
          contentPreview: typeof response.data === 'string' 
            ? response.data.substring(0, 100) + '...' 
            : (typeof response.data === 'object' ? JSON.stringify(response.data).substring(0, 100) + '...' : 'N/A')
        });
        
        if (response.data) {
          responseData = response.data;
          webhookSuccess = true;
          
          // Check if response actually contains an estimate or just input data
          const containsEstimateIndicators = checkForEstimateIndicators(response.data);
          
          if (containsEstimateIndicators) {
            toast.success("Estimate generated successfully");
          } else {
            toast.warning("Received response, but it may not contain a complete estimate.");
            console.warn("Response does not appear to contain a complete estimate");
          }
        } else {
          // Handle empty response
          toast.warning("Received empty response from estimation service. Using input data instead.");
          console.warn("Empty response from webhook");
        }
      } catch (error: any) {
        console.error("Error sending webhook data with axios:", error);
        
        // Second attempt with fetch + no-cors as fallback
        toast.info("Trying alternative connection method...");
        
        try {
          console.log("Trying fallback webhook method with fetch...");
          
          // Using fetch with no-cors mode
          const fetchResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store",
              "Pragma": "no-cache"
            },
            body: JSON.stringify(webhookData),
          });
          
          console.log("Webhook fallback method completed:", fetchResponse);
          
          // Try to read the response if available
          try {
            const responseText = await fetchResponse.text();
            console.log("RAW Fetch Response:", responseText);
            if (responseText) {
              responseData = responseText;
              rawResponse = responseText;
              webhookSuccess = true;
              
              // Check if response actually contains an estimate
              const containsEstimateIndicators = checkForEstimateIndicators(responseText);
              if (containsEstimateIndicators) {
                toast.success("Estimate generated successfully");
              } else {
                toast.warning("Received response, but it may not contain a complete estimate");
              }
            }
          } catch (readError) {
            console.log("Could not read fetch response:", readError);
          }
        } catch (fallbackError: any) {
          console.error("Fallback webhook method failed:", fallbackError);
          setWebhookError((fallbackError.message || "Connection to estimation service failed."));
          toast.error("Unable to connect to estimation service. Using your input data instead.");
        }
      }
      
      // Helper function to check if response contains estimate indicators
      function checkForEstimateIndicators(responseData: any): boolean {
        // Convert to string if it's an object
        const contentToCheck = typeof responseData === 'object' 
          ? JSON.stringify(responseData) 
          : String(responseData);
        
        const estimateIndicators = [
          "Total Project Cost",
          "Materials & Cost Breakdown",
          "Materials Cost Breakdown",
          "Labor Costs",
          "Labour Costs",
          "Cost Breakdown",
          "| Item | Quantity | Unit Price",
          "| Materials Subtotal |",
          "| Labor Subtotal |",
          "| Labour Subtotal |"
        ];
        
        // Check each indicator and return true if at least one is found
        return estimateIndicators.some(indicator => contentToCheck.includes(indicator));
      }
      
      // --------- MARK: Make.com response handling section ----------
      // If we have a stringified JSON as a response (Make.com might do this)
      if (typeof responseData === "string") {
        try {
          console.log("Attempting to parse string response as JSON:", responseData.substring(0, 100) + "...");
          responseData = JSON.parse(responseData);
          console.log("Successfully parsed string response to JSON with keys:", Object.keys(responseData));
        } catch (e) {
          // fallback: treat as markdown
          console.log("Failed to parse string as JSON, treating as markdown:", e);
          responseData = { markdownContent: responseData };
        }
      }
      
      // Store the raw response for debugging
      responseData = {
        ...responseData,
        rawResponse,
        debugInfo: {
          receivedAt: new Date().toISOString(),
          responseType: typeof rawResponse,
          isTextLongPresent: responseData?.textLong ? true : false,
          isMarkdownContentPresent: responseData?.markdownContent ? true : false,
          webhookMethod: webhookSuccess ? "success" : "failure",
          containsEstimateIndicators: checkForEstimateIndicators(rawResponse),
          rawResponsePreview: typeof rawResponse === 'string' 
            ? rawResponse.substring(0, 100) 
            : (typeof rawResponse === 'object' ? JSON.stringify(rawResponse).substring(0, 100) : 'N/A')
        }
      };
      
      // Now always use textLong if it exists
      if (responseData && typeof responseData === "object" && responseData.textLong) {
        console.log("Using textLong field for estimate rendering:", responseData.textLong.substring(0, 100) + "...");
        responseData = {
          ...responseData,
          markdownContent: responseData.textLong,
          webhookStatus: "textLong-used",
          estimateGenerated: checkForEstimateIndicators(responseData.textLong)
        };
      } else if (!responseData?.markdownContent || responseData.markdownContent.trim().length < 10) {
        // If no valid markdownContent, fallback to user's original markdown input
        console.log("No valid markdown content found, using fallback to input data");
        responseData = {
          ...responseData,
          markdownContent: baseMarkdownContent,
          webhookStatus: "no-valid-markdown-content",
          estimateGenerated: false
        };
      } else {
        // Otherwise check if markdownContent contains estimate indicators
        responseData = {
          ...responseData,
          estimateGenerated: checkForEstimateIndicators(responseData.markdownContent)
        };
      }
      // ---- END: always use Make.com textLong if available for estimate rendering ----

      setEstimationResults(responseData);
      setIsLoading(false);
      nextStep();

      if (webhookError) {
        console.warn("Webhook error occurred but process continued:", webhookError);
      }
    } catch (error: any) {
      console.error("Error in overall process:", error);
      // Create fallback content from the user's input
      const fallbackContent = createMarkdownDescription();
      setEstimationResults({ 
        markdownContent: fallbackContent,
        webhookStatus: "process-error",
        error: error.message || "Error processing estimate"
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
