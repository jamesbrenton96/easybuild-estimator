
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
  
  // Maximum total payload size (8MB to be safe with webhook limits)
  const MAX_TOTAL_SIZE_MB = 8;
  const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

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
        // Validate total file size before processing
        let totalSize = 0;
        payload.files.forEach((file: File) => {
          totalSize += file.size;
        });
        
        console.log(`Total file size: ${totalSize} bytes (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
        
        if (totalSize > MAX_TOTAL_SIZE_BYTES) {
          const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
          throw new Error(`Total file size (${totalSizeMB}MB) exceeds the ${MAX_TOTAL_SIZE_MB}MB limit. Please reduce file sizes or number of files.`);
        }
        
        // Create FormData for multipart/form-data submission
        const formData = new FormData();
        
        console.log(`Processing ${payload.files.length} files for webhook submission`);
        
        // Add all files with the exact naming convention your webhook expects
        payload.files.forEach((file: File, index: number) => {
          if (file instanceof File && file.size > 0) {
            const fieldName = `file_${index}`;
            console.log(`Adding file ${index}: ${file.name} as ${fieldName}, Type: ${file.type}, Size: ${file.size} bytes`);
            formData.append(fieldName, file, file.name);
          }
        });
        
        // Add file count for webhook processing
        formData.append('fileCount', String(payload.files.length));
        
        // Create a copy of the payload without the files for the meta field
        const metaData = { ...payload };
        delete metaData.files;
        
        // Add the rest of the form data as a JSON string in the 'meta' field
        formData.append('meta', JSON.stringify(metaData));
        
        console.log(`Sending FormData with ${payload.files.length} files to webhook`);
        console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => ({
          key,
          valueType: typeof value,
          isFile: value instanceof File,
          fileName: value instanceof File ? value.name : undefined
        })));
        
        // Send the form data with a longer timeout for large uploads
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
        
        try {
          const response = await fetch(webhookUrl, {
            method: "POST",
            body: formData,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            console.error(`Webhook response not ok: ${response.status} ${response.statusText}`);
            const responseText = await response.text();
            console.error(`Response body: ${responseText}`);
            
            // Provide more specific error messages
            if (response.status === 413) {
              throw new Error(`File upload too large. Your webhook rejected the ${(totalSize / 1024 / 1024).toFixed(2)}MB upload. Try reducing file sizes.`);
            } else if (response.status === 400) {
              throw new Error(`Bad request: ${response.statusText}. This might be due to file size or format issues.`);
            }
            
            throw new Error(`Webhook error: ${response.status} ${response.statusText} - ${responseText}`);
          }
          
          return handleWebhookResponse(response);
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          
          if (fetchError.name === 'AbortError') {
            throw new Error('Upload timeout - files may be too large or connection too slow. Try reducing file sizes.');
          }
          
          // Check for network-related errors
          if (fetchError.message.includes('Load failed') || fetchError.message.includes('network')) {
            throw new Error(`Network error during upload. This often happens with large files (${(totalSize / 1024 / 1024).toFixed(2)}MB). Try reducing file sizes or check your connection.`);
          }
          
          throw fetchError;
        }
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
      console.error("Webhook submission error:", error);
      console.error("Error details:", {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
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
