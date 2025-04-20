
import React, { useState } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { toast } from "sonner";
import { useWebhookEstimate } from "./useWebhookEstimate";
import {
  createStructuredEstimate,
  createMarkdownDescription,
  getFullCorrespondenceType,
} from "./estimateUtils";

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
  const { getEstimate } = useWebhookEstimate();

  const handleSubmit = async () => {
    setIsLoading(true);
    setWebhookError(null);

    // Prepare payload for webhook
    const correspondenceType = formData.subcategories?.correspondence?.type || "";
    const fullCorrespondenceType = getFullCorrespondenceType(correspondenceType);
    const clientName = formData.subcategories?.correspondence?.clientName || "";
    const date = formData.subcategories?.correspondence?.date || new Date().toLocaleDateString();

    const webhookData = {
      clientInfo: {
        name: clientName,
        date: date,
        correspondenceType: fullCorrespondenceType,
      },
      projectDetails: {
        name: formData.subcategories?.projectName?.content || "Custom building project",
        overview: formData.subcategories?.overview?.content || "",
        type: formData.projectType || "",
        dimensions: formData.subcategories?.dimensions?.content || "",
        materials: formData.subcategories?.materials?.content || "",
        timeframe: formData.subcategories?.timeframe?.content || "",
        additionalWork: formData.subcategories?.additionalWork?.content || "",
        location: formData.subcategories?.locationDetails?.content || "",
        notes: formData.subcategories?.notes?.content || "",
      },
    };

    try {
      // Try webhook
      const webhookResponseData = await getEstimate(webhookData);

      let markdownContent = createMarkdownDescription(formData);
      let structuredEstimate = createStructuredEstimate(formData);

      if (
        webhookResponseData &&
        (webhookResponseData.estimate ||
          webhookResponseData.textContent ||
          webhookResponseData.markdownContent)
      ) {
        const estimationResults = {
          markdownContent:
            webhookResponseData.markdownContent ||
            webhookResponseData.textContent ||
            markdownContent,
          estimate: webhookResponseData.estimate || structuredEstimate,
          webhookResponseData,
          estimateGenerated: true,
        };

        setEstimationResults(estimationResults);
        setIsLoading(false);
        nextStep();
        toast.success("Estimate generated successfully");
      } else {
        const estimationResults = {
          markdownContent,
          estimate: structuredEstimate,
          webhookResponseData,
          fallbackContent: markdownContent,
          estimateGenerated: true,
          debugInfo: "Used local fallback due to invalid webhook response",
        };

        setEstimationResults(estimationResults);
        setIsLoading(false);
        nextStep();
        toast.success("Estimate generated (using local calculator)");
      }
    } catch (error: any) {
      setWebhookError(error.message);

      const fallbackContent = createMarkdownDescription(formData);
      const structuredEstimate = createStructuredEstimate(formData);

      setEstimationResults({
        markdownContent: fallbackContent,
        estimate: structuredEstimate,
        error: error.message || "Error processing estimate",
        fallbackContent,
        estimateGenerated: true,
        debugInfo: `Used fallback due to error: ${error.message}`,
      });

      setIsLoading(false);
      nextStep();
      toast.warning("Using local estimate due to connection issues");
    }
  };

  return (
    <>
      {webhookError && (
        <div className="text-white/80 text-sm mb-4 p-3 bg-red-500/20 rounded border border-red-400/30">
          <strong>Connection Error:</strong> The estimate service couldn't be reached. Local fallback used.
        </div>
      )}
      <button
        onClick={handleSubmit}
        className={`btn-next ${isMobile ? "order-1" : ""}`}
      >
        Generate Estimate
      </button>
    </>
  );
}
