
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
        return await response.json();
      } catch {
        // Fallback, maybe it's just text
        const textContent = await response.text();
        return { textContent };
      }
    } catch (error: any) {
      throw new Error(error?.message || "Unknown error with estimate generation.");
    }
  }, []);

  return { getEstimate };
}
