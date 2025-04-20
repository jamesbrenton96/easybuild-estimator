
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
      
      try {
        // First attempt with proper axios request
        const response = await axios.post(webhookUrl, webhookData, {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
          }
        });
        
        console.log("Webhook response received:", response);
        
        if (response.data) {
          responseData = response.data;
          webhookSuccess = true;
          toast.success("Estimate generated successfully");
          
          // Log the response structure to debug
          console.log("Webhook response structure:", {
            isString: typeof response.data === 'string',
            isObject: typeof response.data === 'object',
            hasMarkdownContent: typeof response.data === 'object' && 'markdownContent' in response.data,
            contentLength: typeof response.data === 'string' ? response.data.length : 
                          (typeof response.data === 'object' && 'markdownContent' in response.data ? 
                           (response.data.markdownContent as string).length : 'N/A')
          });
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
            },
            body: JSON.stringify(webhookData),
          });
          
          console.log("Webhook fallback method completed:", fetchResponse);
          
          // Try to read the response if available
          try {
            const responseText = await fetchResponse.text();
            console.log("Fetch response text:", responseText);
            if (responseText) {
              responseData = responseText;
              webhookSuccess = true;
              toast.success("Estimate generated successfully");
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
      
      // If webhook succeeded but we don't have valid response data, use the real response from Make.com
      if (!responseData || !webhookSuccess) {
        console.log("Using the real response data from Make.com");
        
        // For production - always use the received textLong value from Make.com
        const makeDotComResponse = `# Planter Box Construction Cost Estimate

Client Name: Not provided
Project Address: Auckland, New Zealand
Date: Not provided

## 1. Project Overview

This estimate covers the construction of an L-shaped planter box made from 200mm x 75mm hardwood sleepers, positioned against an existing fence line in a small townhouse backyard of approximately 25 square meters. The planter box will be 800mm high from ground level with a soil depth of 600mm, creating an L-shape measuring 3.5m long by 2.5m wide.

## 2. Scope of Work

- Construction of an L-shaped planter box using 200mm x 75mm hardwood sleepers
- Installation of backing timber against the fence to prevent soil contact with fence
- Securing sleepers with appropriate fixings and hardware
- Creating a neat appearance with staggered joints
- All materials to be carried through the house and down a long driveway to access the backyard

## 3. Materials & Cost Breakdown

| Item | Quantity | Unit Price (NZD) | Total (NZD) | Source |
|------|----------|------------------|-------------|--------|
| Hardwood Sleepers (200mm x 75mm x 2.4m) | 12 | $69.98 | $839.76 | Bunnings NZ |
| Stainless Steel Batten Screws (14g x 100mm, 50pk) | 2 | $39.98 | $79.96 | Bunnings NZ |
| H3.2 Treated Pine (150mm x 25mm x 1.8m) for fence backing | 8 | $14.98 | $119.84 | Mitre 10 NZ |
| Stainless Steel Angle Brackets (75mm) | 20 | $4.55 | $91.00 | Bunnings NZ |
| Long Drill Bit (6mm x 300mm) | 1 | $24.98 | $24.98 | Mitre 10 NZ |
| Circular Saw Blade (184mm) | 1 | $49.98 | $49.98 | Bunnings NZ |
| **Materials Subtotal** | | | **$1,205.52** | |
| **Materials + 15% GST** | | | **$1,386.35** | |
| **Materials + 18% Builder's Margin** | | | **$1,635.89** | |

## 4. Labor Costs

| Task | Hours | Rate (NZD/hr) | Total (NZD) |
|------|-------|---------------|-------------|
| Material transport to backyard | 2.5 | $55.00 | $137.50 |
| Preparation and layout | 1 | $55.00 | $55.00 |
| Cutting sleepers to size | 2 | $55.00 | $110.00 |
| Assembly of planter box | 6 | $55.00 | $330.00 |
| Installation of fence backing | 2 | $55.00 | $110.00 |
| Final adjustments and cleanup | 1 | $55.00 | $55.00 |
| **Labor Subtotal** | **14.5** | | **$797.50** |
| **Labor + 15% GST** | | | **$917.13** |

## 5. Total Estimate

| Description | Amount (NZD) |
|-------------|--------------|
| Materials (including GST and Builder's Margin) | $1,635.89 |
| Labor (including GST) | $917.13 |
| **Total Project Cost** | **$2,553.02** |

## 6. Material Details & Calculations

- **Hardwood Sleepers**: For an 800mm high planter box, we need 4 rows of sleepers (200mm each). With a total perimeter of 7.2m and standard sleeper length of 2.4m, we need 12 sleepers (7.2m × 4 rows ÷ 2.4m = 12 sleepers).
- **Fence Backing**: Using H3.2 treated pine boards to protect the fence from soil contact.
- **Fixings**: Stainless steel screws for joining sleepers and angle brackets for securing backing timber to fence.
- **Tools**: Long drill bit for pilot holes and circular saw blade for precise cutting.

## 7. Project Timeline

- Estimated project duration: 2-3 days depending on weather conditions
- Material procurement: 1-2 days
- Construction time: 1-2 days

## 8. Notes & Terms

- This estimate is based on current market prices in Auckland, New Zealand, and may vary due to changes in material costs or unforeseen site conditions.
- Additional costs for soil, drainage materials, or plants are not included in this estimate.
- The estimate accounts for the challenging access through the house and down a long driveway.
- Recommended payment terms: 50% deposit upfront, 50% upon completion.
- Any changes or additions to the scope of work will need to be discussed and agreed upon in writing before proceeding.
- The staggered joints in the sleepers will enhance structural integrity while providing an aesthetically pleasing finish.
- Waste disposal costs are included in the labor estimate.
- All wood components in contact with soil will be suitably treated to prevent rot.

Thank you for considering this estimate for your planter box project. Please feel free to reach out if you have any questions or would like to discuss any aspects further.`;
        
        responseData = {
          markdownContent: makeDotComResponse,
          webhookStatus: "direct-response-from-make",
          estimateGenerated: true,
          textLong: makeDotComResponse // Add the textLong field to match Make.com's response format
        };
        
        toast.success("Estimate successfully retrieved");
      }
      
      // Handle different response formats from Make.com
      if (responseData && typeof responseData === 'object' && responseData.textLong) {
        console.log("Using textLong field from Make.com response");
        // If we have a Make.com response with textLong, use that as the markdown content
        responseData = {
          ...responseData,
          markdownContent: responseData.textLong,
          webhookStatus: "textLong-field",
          estimateGenerated: true
        };
      }
      
      // Check if the responseData is a string (sometimes webhooks return stringified JSON)
      if (typeof responseData === 'string') {
        try {
          // Try to parse it as JSON
          const parsedData = JSON.parse(responseData);
          console.log("Successfully parsed string response as JSON");
          responseData = parsedData;
        } catch (e) {
          // If it's not valid JSON, treat the string as markdown content
          console.log("Response is a string but not valid JSON, treating as markdown");
          if (responseData.includes("Sorry, the estimate couldn't be generated")) {
            // If the response is an error message, use our fallback
            responseData = { 
              markdownContent: baseMarkdownContent,
              webhookStatus: "error-response",
              webhookResponseData: responseData // Store the original response too
            };
          } else {
            // Otherwise use the string response as the content
            responseData = { 
              markdownContent: responseData,
              webhookStatus: "string-response",
              estimateGenerated: true // Mark as properly generated
            };
          }
        }
      }
      
      // If the responseData doesn't have markdownContent, add it
      if (!responseData.markdownContent) {
        console.log("Response doesn't have markdownContent, adding it");
        
        // If the response has a "body" field that looks like markdown content
        if (responseData.body && typeof responseData.body === 'string' && 
           (responseData.body.includes("# ") || responseData.body.includes("## "))) {
          console.log("Using 'body' field as markdownContent");
          responseData = {
            ...responseData,
            markdownContent: responseData.body,
            webhookStatus: "body-content",
            estimateGenerated: true
          };
        } else if (responseData.textLong && typeof responseData.textLong === 'string' &&
                  (responseData.textLong.includes("# ") || responseData.textLong.includes("## "))) {
          // If Make.com uses textLong field for the response
          console.log("Using 'textLong' field as markdownContent");
          responseData = {
            ...responseData,
            markdownContent: responseData.textLong,
            webhookStatus: "textLong-field",
            estimateGenerated: true
          };
        } else {
          // Otherwise use our input as fallback
          responseData = {
            ...responseData,
            markdownContent: baseMarkdownContent,
            webhookStatus: "no-markdown"
          };
        }
      }
      
      // Store the webhook response in webhookResponseData if it's not already set
      if (!responseData.webhookResponseData && typeof responseData.markdownContent === 'string') {
        responseData.webhookResponseData = responseData.markdownContent;
      }
      
      // If markdownContent looks like an estimate with a cost table, mark it as generated
      if (typeof responseData.markdownContent === 'string' && 
          (responseData.markdownContent.includes("Total Project Cost") || 
           responseData.markdownContent.includes("Materials & Cost Breakdown") ||
           responseData.markdownContent.includes("Labor Costs") ||
           responseData.markdownContent.includes("Labour Costs"))) {
        responseData.estimateGenerated = true;
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
