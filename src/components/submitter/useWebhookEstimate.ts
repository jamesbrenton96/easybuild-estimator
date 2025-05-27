import { useCallback } from "react";
import { getFullCorrespondenceType } from "./markdown/correspondence";

export interface WebhookResponse {
  markdownContent?: string;
  estimate?: any;
  textContent?: string;
  error?: string;
  [key: string]: any;
}

// This hook handles calling the webhook and parsing the result
export function useWebhookEstimate() {
  const webhookUrl = "https://hook.us2.make.com/niu1dp65y66kc2r3j56xdcl607sp8fyr";

  const getEstimate = useCallback(async (payload: Record<string, any>): Promise<WebhookResponse> => {
    try {
      console.log("Preparing payload for webhook submission");
      
      // Format the correspondence type to its full name before sending
      if (payload.subcategories?.correspondence?.type) {
        const correspondenceType = payload.subcategories.correspondence.type;
        payload.subcategories.correspondence.fullType = getFullCorrespondenceType(correspondenceType);
      }
      
      // Check if there are any files in the payload
      const hasFiles = Array.isArray(payload.files) && payload.files.length > 0;
      
      if (hasFiles) {
        // Create FormData for multipart/form-data submission
        const formData = new FormData();
        
        // Add all files to the form data with exact naming pattern: file_0, file_1, file_2, file_3
        payload.files.forEach((file: File, index: number) => {
          if (file instanceof File) {
            console.log(`Adding file ${index}: ${file.name} as file_${index}`);
            formData.append(`file_${index}`, file, file.name);
          }
        });
        
        // Add file count
        formData.append('fileCount', String(payload.files.length));
        
        // Create a clean copy of the payload without the files for the meta field
        const metaData = { ...payload };
        delete metaData.files;
        
        // Add the rest of the form data as JSON in the 'meta' field
        formData.append('meta', JSON.stringify(metaData));
        
        console.log(`Sending ${payload.files.length} files to webhook with names: ${payload.files.map((_, i) => `file_${i}`).join(', ')}`);
        
        // Debug: Log what we're sending
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`FormData contains: ${key} = File(${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`FormData contains: ${key} = ${typeof value === 'string' ? value.substring(0, 100) + '...' : value}`);
          }
        }
        
        // Send the form data without setting Content-Type (browser will set it correctly with boundary)
        const response = await fetch(webhookUrl, {
          method: "POST",
          body: formData
        });
        
        if (!response.ok) throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
        
        return handleWebhookResponse(response);
      } else {
        // If no files, send a regular JSON payload
        console.log("No files present, sending regular JSON payload");
        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*"
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
        
        return handleWebhookResponse(response);
      }
    } catch (error: any) {
      console.error("Webhook error:", error);
      return { 
        error: error?.message || "Unknown error with estimate generation.",
        markdownContent: null
      };
    }
  }, []);
  
  // Helper function to handle webhook response
  const handleWebhookResponse = async (response: Response): Promise<WebhookResponse> => {
    try {
      // Try JSON first
      const jsonData = await response.json();
      console.log("Webhook JSON response:", jsonData);
      
      // Handle array response format (Make.com typical format)
      if (Array.isArray(jsonData)) {
        console.log("Detected array response format");
        
        // Look for a text entry in the array
        const textEntry = jsonData.find(
          item => item && typeof item === "object" && item.type === "text" && typeof item.text === "string"
        );
        
        if (textEntry) {
          console.log("Found text entry in array response");
          return {
            markdownContent: textEntry.text,
            rawResponse: jsonData
          };
        }
        
        return {
          rawResponse: jsonData,
          // Just provide the raw response since we didn't find structured text
          textContent: JSON.stringify(jsonData)
        };
      }
      
      // If the response contains markdown content
      if (jsonData.markdownContent || 
          (jsonData.textContent && isMarkdownLike(jsonData.textContent)) || 
          (typeof jsonData === 'string' && isMarkdownLike(jsonData))) {
        
        return {
          markdownContent: jsonData.markdownContent || jsonData.textContent || jsonData,
          rawResponse: jsonData
        };
      }
      
      return jsonData;
    } catch (jsonError) {
      console.log("Not a JSON response, trying as text");
      // If not JSON, try as text
      try {
        const textContent = await response.text();
        console.log("Webhook text response:", textContent);
        
        // Check if it looks like markdown
        if (isMarkdownLike(textContent)) {
          console.log("Detected markdown-like content in response");
          return { 
            markdownContent: textContent,
            rawResponse: textContent
          };
        }
        
        return { textContent };
      } catch (textError) {
        throw new Error("Failed to parse response as JSON or text");
      }
    }
  };

  // Helper function to detect markdown-like content
  const isMarkdownLike = (text: string): boolean => {
    if (!text) return false;
    
    // Check for markdown headers, lists, tables
    const markdownPatterns = [
      /^#\s+.+$/m,                 // Headers
      /^-\s+.+$/m,                 // Unordered list
      /^\d+\.\s+.+$/m,             // Ordered list
      /^\|(.+\|)+$/m,              // Table rows
      /^\|(\s*[-:]+\s*\|)+$/m,     // Table header separator
      /^\*\*[^*]+\*\*$/m,          // Bold text
      /^##\s+\d+\.\s+.+$/m,        // Numbered section headers
      /^Construction Cost Estimate/m // Specific to your estimate
    ];
    
    // Return true if any markdown pattern is found
    return markdownPatterns.some(pattern => pattern.test(text));
  };

  return { getEstimate };
}
