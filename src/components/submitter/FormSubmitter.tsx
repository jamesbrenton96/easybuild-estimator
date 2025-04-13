
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
            } else if (jsonResponse.type === "text" && jsonResponse.text) {
              // Single text object format
              setEstimationResults({
                markdownContent: jsonResponse.text,
                estimate: null
              });
            } else if (Array.isArray(jsonResponse) && jsonResponse[0]?.type === "text") {
              // Array of text objects format
              const markdownContent = jsonResponse
                .filter(item => item.type === "text" && item.text)
                .map(item => item.text)
                .join("\n");
              
              setEstimationResults({
                markdownContent: markdownContent,
                estimate: null
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
    <button
      onClick={handleSubmit}
      className={`btn-next ${isMobile ? 'order-1' : ''} ${isMobile ? 'w-full' : 'px-8'}`}
    >
      Generate Estimate
    </button>
  );
}
