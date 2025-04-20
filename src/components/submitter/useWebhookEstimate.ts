
import { useCallback } from "react";

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
      console.log("Sending payload to webhook:", payload);
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Webhook error: ${response.status} ${response.statusText}`);

      try {
        // Try JSON first
        const jsonData = await response.json();
        console.log("Webhook JSON response:", jsonData);
        
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
    } catch (error: any) {
      console.error("Webhook error:", error);
      return { 
        error: error?.message || "Unknown error with estimate generation.",
        markdownContent: null
      };
    }
  }, []);

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
