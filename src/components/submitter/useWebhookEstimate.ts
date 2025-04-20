
import { useCallback } from "react";

export interface WebhookResponse {
  markdownContent?: string;
  estimate?: any;
  textContent?: string;
  [key: string]: any;
}

// This hook handles calling the webhook and parsing the result
export function useWebhookEstimate() {
  const webhookUrl = "https://hook.us2.make.com/niu1dp65y66kc2r3j56xdcl607sp8fyr";

  const getEstimate = useCallback(async (payload: Record<string, any>): Promise<WebhookResponse> => {
    try {
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
        return jsonData;
      } catch (jsonError) {
        // If not JSON, try as text
        try {
          const textContent = await response.text();
          console.log("Webhook text response:", textContent);
          
          // Check if it looks like markdown
          if (textContent.includes('# ') || textContent.includes('\n## ')) {
            return { markdownContent: textContent };
          }
          
          return { textContent };
        } catch (textError) {
          throw new Error("Failed to parse response as JSON or text");
        }
      }
    } catch (error: any) {
      console.error("Webhook error:", error);
      throw new Error(error?.message || "Unknown error with estimate generation.");
    }
  }, []);

  return { getEstimate };
}
