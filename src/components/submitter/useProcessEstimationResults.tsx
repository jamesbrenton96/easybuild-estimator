import React from "react";
import MarkdownEstimate from "../estimate/MarkdownEstimate";
import StructuredEstimate from "../estimate/StructuredEstimate";
import FallbackEstimate from "../estimate/FallbackEstimate";

export function useProcessEstimationResults(estimationResults: any) {
  console.log("Processing estimation results:", estimationResults);
  
  if (!estimationResults) {
    console.log("No estimation results provided");
    return <FallbackEstimate errorDetails="No estimation data received from the service." />;
  }

  // NEW: Handle if estimationResults is an array of objects with .type and .text (for Make.com/other bots)
  if (Array.isArray(estimationResults)) {
    console.log("Detected array response with", estimationResults.length, "items");
    
    // Try to find the first object with type === 'text' and a .text property
    const textEntry = estimationResults.find(
      (item: any) => item && typeof item === "object" && item.type === "text" && typeof item.text === "string"
    );
    
    if (textEntry) {
      console.log("Found text entry in array with content:", textEntry.text.substring(0, 100));
      const textContent = textEntry.text;
      
      // Ensure proper line breaks between sections
      const formattedContent = textContent
        // Ensure proper line breaks before section headers
        .replace(/##(\s*)(\d+)\.(\s*)/g, "\n\n## $2.$3")
        // Ensure each table row has a proper line break
        .replace(/\|\s*\n/g, "|\n");
      
      // Check if textContent is valid estimate markdown
      if (formattedContent && formattedContent.trim().length > 0) {
        console.log("Using text content from array item");
        return (
          <MarkdownEstimate
            markdownContent={formattedContent}
            rawResponse={estimationResults}
          />
        );
      }
    }
    
    // If we couldn't find a text entry, try to stringify the whole array
    console.log("No text entry found in array, trying to stringify");
    const stringifiedArray = JSON.stringify(estimationResults, null, 2);
    return (
      <MarkdownEstimate
        markdownContent={stringifiedArray}
        rawResponse={estimationResults}
      />
    );
  }

  // Function to check if the content looks like a valid estimate
  const isValidEstimateContent = (content: string) => {
    if (!content) return false;
    
    const estimateIndicators = [
      "Total Project Cost",
      "Materials & Cost Breakdown",
      "Material Cost Breakdown",
      "Labor Costs",
      "Labour Costs",
      "Construction Cost Estimate",
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

  // Case 1: Check for error
  if (estimationResults.error) {
    console.log("Error in estimation results:", estimationResults.error);
    return <FallbackEstimate errorDetails={estimationResults.error} />;
  }

  // Case 2: We have a clearly marked successful estimate with markdownContent
  if (estimationResults.markdownContent) {
    console.log("Found markdownContent in results");
    const content = estimationResults.markdownContent;
    
    if (typeof content === 'string' && content.trim().length > 0 && isValidEstimateContent(content)) {
      console.log("Using markdown content from markdownContent field");
      return (
        <MarkdownEstimate
          markdownContent={content}
          rawResponse={estimationResults.rawResponse}
        />
      );
    }
  }

  // Case 3: Check for textLong field (common webhook response format)
  if (estimationResults.textLong && typeof estimationResults.textLong === "string" && estimationResults.textLong.trim().length > 0) {
    console.log("Using textLong field");
    if (isValidEstimateContent(estimationResults.textLong)) {
      return (
        <MarkdownEstimate
          markdownContent={estimationResults.textLong}
          rawResponse={estimationResults.rawResponse}
        />
      );
    }
  }

  // Case 4: Check for just textContent field (basic webhook response)
  if (estimationResults.textContent && typeof estimationResults.textContent === "string" && estimationResults.textContent.trim().length > 0) {
    console.log("Using textContent field");
    if (isValidEstimateContent(estimationResults.textContent)) {
      return (
        <MarkdownEstimate
          markdownContent={estimationResults.textContent}
          rawResponse={estimationResults.rawResponse}
        />
      );
    }
  }

  // Case 5: Check for structured estimate
  if (estimationResults.estimate) {
    console.log("Using structured estimate");
    return <StructuredEstimate estimate={estimationResults.estimate} />;
  }

  // Case 6: Check if the raw response itself might be markdown content
  if (typeof estimationResults === "string" && estimationResults.trim().length > 0) {
    console.log("Using raw string response");
    if (isValidEstimateContent(estimationResults)) {
      return <MarkdownEstimate markdownContent={estimationResults} />;
    }
  }

  // Case 7: Handle raw data that might be in an unexpected format
  if (typeof estimationResults === 'object') {
    console.log("Trying to extract markdown from unknown object structure");
    
    // Try to find any string property that might contain markdown
    for (const key in estimationResults) {
      const value = estimationResults[key];
      if (typeof value === 'string' && value.trim().length > 0 && isValidEstimateContent(value)) {
        console.log(`Found potential markdown content in field: ${key}`);
        return <MarkdownEstimate markdownContent={value} />;
      }
    }
    
    // If we have a data property, try that
    if (estimationResults.data) {
      console.log("Checking data property for markdown");
      if (typeof estimationResults.data === 'string' && isValidEstimateContent(estimationResults.data)) {
        return <MarkdownEstimate markdownContent={estimationResults.data} />;
      } else if (typeof estimationResults.data === 'object') {
        // Recursively try to process the data property
        const result = useProcessEstimationResults(estimationResults.data);
        if (result) return result;
      }
    }
  }

  // If no valid estimate format was found but we have a fallback
  if (estimationResults.fallbackContent) {
    console.log("Using fallback content");
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.fallbackContent}
        rawResponse={estimationResults.rawResponse}
      />
    );
  }

  // As a last resort, stringify the entire response and display as raw text
  if (estimationResults) {
    const stringified = typeof estimationResults === 'string' 
      ? estimationResults 
      : JSON.stringify(estimationResults, null, 2);
      
    if (stringified && stringified.length > 0) {
      console.log("Displaying raw stringified response as last resort");
      return <MarkdownEstimate markdownContent={`\`\`\`json\n${stringified}\n\`\`\``} />;
    }
  }

  console.log("No valid estimate found in response:", estimationResults);
  return <FallbackEstimate errorDetails="No valid estimation data received from the service." />;
}
