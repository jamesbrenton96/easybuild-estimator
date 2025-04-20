
import React from "react";
import MarkdownEstimate from "../estimate/MarkdownEstimate";
import StructuredEstimate from "../estimate/StructuredEstimate";
import FallbackEstimate from "../estimate/FallbackEstimate";

export function useProcessEstimationResults(estimationResults: any) {
  if (!estimationResults) return null;
  
  // Function to check if the content looks like a valid estimate
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
      "Notes & Terms",
      "Project Overview"
    ];
    
    let matchCount = 0;
    estimateIndicators.forEach(indicator => {
      if (content.includes(indicator)) matchCount++;
    });
    
    const hasTable = content.includes("|") && content.includes("---");
    
    // Lower the threshold to 1 indicator to be more lenient with formats
    return matchCount >= 1 || hasTable;
  };

  // Case 1: We have a clearly marked successful estimate
  if (estimationResults.estimateGenerated === true && estimationResults.markdownContent) {
    console.log("Using marked successful estimate");
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.markdownContent}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  // Case 2: Check for textLong field (common webhook response format)
  if (
    estimationResults.textLong &&
    typeof estimationResults.textLong === "string" &&
    estimationResults.textLong.length > 0
  ) {
    console.log("Using textLong field");
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.textLong}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  // Case 3: Check for just textContent field (basic webhook response)
  if (
    estimationResults.textContent &&
    typeof estimationResults.textContent === "string" &&
    estimationResults.textContent.length > 0
  ) {
    console.log("Using textContent field");
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.textContent}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  // Case 4: Check markdownContent 
  if (
    estimationResults.markdownContent &&
    typeof estimationResults.markdownContent === "string" &&
    estimationResults.markdownContent.length > 0
  ) {
    console.log("Using markdownContent field");
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.markdownContent}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  // Case 5: Check for structured estimate
  if (estimationResults.estimate) {
    console.log("Using structured estimate");
    return <StructuredEstimate estimate={estimationResults.estimate} />;
  }

  // Case 6: Fallback content if provided
  if (estimationResults.fallbackContent) {
    console.log("Using fallback content");
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.fallbackContent}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  // Case 7: Check if the raw response itself might be markdown content
  if (typeof estimationResults === "string" && estimationResults.length > 0) {
    console.log("Using raw string response");
    return <MarkdownEstimate markdownContent={estimationResults} />;
  }

  // Error case
  if (estimationResults.error) {
    console.log("Showing error response");
    return <FallbackEstimate errorDetails={estimationResults.error} />;
  }

  console.log("No valid estimate found in response:", estimationResults);
  return <FallbackEstimate errorDetails="No estimation data received from the service." />;
}
