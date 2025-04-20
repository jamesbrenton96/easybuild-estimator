import React from "react";
import MarkdownEstimate from "../estimate/MarkdownEstimate";
import StructuredEstimate from "../estimate/StructuredEstimate";
import FallbackEstimate from "../estimate/FallbackEstimate";

export function useProcessEstimationResults(estimationResults: any) {
  if (!estimationResults) return null;

  // (Extracted logic from original ReviewStep code's processEstimationResults function)
  // Duplicated verbatim (for now, can factor more, but keeping your logic).
  const isValidEstimateContent = (content: string) => {
    if (!content) return false;
    const estimateIndicators = [
      "Total Project Cost",
      "Materials & Cost Breakdown",
      "Material Cost Breakdown",
      "Labor Costs",
      "Labour Costs",
      "| Materials Subtotal |",
      "| Labor Subtotal |",
      "| Labour Subtotal |",
      "| Item | Quantity | Unit Price",
      "Cost Breakdown",
      "Project Timeline",
      "Material Details & Calculations",
      "Notes & Terms"
    ];
    let matchCount = 0;
    estimateIndicators.forEach(indicator => {
      if (content.includes(indicator)) matchCount++;
    });
    const hasTable = content.includes("|") && content.includes("---");
    return matchCount >= 2 || (hasTable && matchCount >= 1);
  };

  if (estimationResults.estimateGenerated === true && estimationResults.markdownContent) {
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.markdownContent}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  if (
    estimationResults.textLong &&
    typeof estimationResults.textLong === "string" &&
    isValidEstimateContent(estimationResults.textLong)
  ) {
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.textLong}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  if (
    estimationResults.markdownContent &&
    isValidEstimateContent(estimationResults.markdownContent)
  ) {
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.markdownContent}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  if (estimationResults.estimate) {
    return <StructuredEstimate estimate={estimationResults.estimate} />;
  }

  if (estimationResults.markdownContent) {
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.markdownContent}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  if (estimationResults.fallbackContent) {
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.fallbackContent}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  if (estimationResults.error) {
    return <FallbackEstimate errorDetails={estimationResults.error} />;
  }

  return <FallbackEstimate errorDetails="No estimation data received from the service." />;
}
