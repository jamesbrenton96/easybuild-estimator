
import React from "react";
import MarkdownEstimate from "../estimate/MarkdownEstimate";
import StructuredEstimate from "../estimate/StructuredEstimate";
import FallbackEstimate from "../estimate/FallbackEstimate";
import { isValidEstimateContent } from "./isValidEstimateContent";

/**
 * Extract and select the appropriate estimate display component based on API estimation results.
 * Used in useProcessEstimationResults hook for rendering.
 */
export function useEstimateSelector(
  estimationResults: any,
  projectDetails?: { clientName?: string; projectAddress?: string; date?: string }
) {
  // Early invalid
  if (!estimationResults) {
    return <FallbackEstimate errorDetails="No estimation data received from the service." />;
  }

  // Handle Make.com/other bots array with .type, .text
  if (Array.isArray(estimationResults)) {
    const textEntry = estimationResults.find(
      (item: any) =>
        item &&
        typeof item === "object" &&
        item.type === "text" &&
        typeof item.text === "string"
    );
    if (textEntry) {
      return (
        <MarkdownEstimate
          markdownContent={textEntry.text}
          rawResponse={estimationResults}
          projectDetails={projectDetails}
        />
      );
    }
    // Fallback: stringify array
    const stringifiedArray = JSON.stringify(estimationResults, null, 2);
    return (
      <MarkdownEstimate
        markdownContent={stringifiedArray}
        rawResponse={estimationResults}
        projectDetails={projectDetails}
      />
    );
  }

  // Error case
  if (estimationResults.error) {
    return <FallbackEstimate errorDetails={estimationResults.error} />;
  }

  // markdownContent key
  if (estimationResults.markdownContent) {
    const content = estimationResults.markdownContent;
    if (
      typeof content === "string" &&
      content.trim().length > 0 &&
      isValidEstimateContent(content)
    ) {
      return (
        <MarkdownEstimate
          markdownContent={content}
          rawResponse={estimationResults.rawResponse}
          projectDetails={projectDetails}
        />
      );
    }
  }

  // textLong
  if (
    estimationResults.textLong &&
    typeof estimationResults.textLong === "string" &&
    estimationResults.textLong.trim().length > 0
  ) {
    if (isValidEstimateContent(estimationResults.textLong)) {
      return (
        <MarkdownEstimate
          markdownContent={estimationResults.textLong}
          rawResponse={estimationResults.rawResponse}
          projectDetails={projectDetails}
        />
      );
    }
  }

  // textContent
  if (
    estimationResults.textContent &&
    typeof estimationResults.textContent === "string" &&
    estimationResults.textContent.trim().length > 0
  ) {
    if (isValidEstimateContent(estimationResults.textContent)) {
      return (
        <MarkdownEstimate
          markdownContent={estimationResults.textContent}
          rawResponse={estimationResults.rawResponse}
          projectDetails={projectDetails}
        />
      );
    }
  }

  // structured estimate
  if (estimationResults.estimate) {
    return <StructuredEstimate estimate={estimationResults.estimate} />;
  }

  // raw string as markdown
  if (
    typeof estimationResults === "string" &&
    estimationResults.trim().length > 0
  ) {
    if (isValidEstimateContent(estimationResults)) {
      return (
        <MarkdownEstimate
          markdownContent={estimationResults}
          projectDetails={projectDetails}
        />
      );
    }
  }

  // Unknown object: try extracting string property
  if (typeof estimationResults === "object") {
    for (const key in estimationResults) {
      const value = estimationResults[key];
      if (
        typeof value === "string" &&
        value.trim().length > 0 &&
        isValidEstimateContent(value)
      ) {
        return (
          <MarkdownEstimate
            markdownContent={value}
            projectDetails={projectDetails}
          />
        );
      }
    }
    // If data property: recurse
    if (estimationResults.data) {
      if (
        typeof estimationResults.data === "string" &&
        isValidEstimateContent(estimationResults.data)
      ) {
        return (
          <MarkdownEstimate
            markdownContent={estimationResults.data}
            projectDetails={projectDetails}
          />
        );
      } else if (typeof estimationResults.data === "object") {
        // Recursively process
        return useEstimateSelector(estimationResults.data, projectDetails);
      }
    }
  }

  // fallbackContent
  if (estimationResults.fallbackContent) {
    return (
      <MarkdownEstimate
        markdownContent={estimationResults.fallbackContent}
        rawResponse={estimationResults.rawResponse}
        projectDetails={projectDetails}
      />
    );
  }

  // LAST RESORT: stringify all
  if (estimationResults) {
    const stringified =
      typeof estimationResults === "string"
        ? estimationResults
        : JSON.stringify(estimationResults, null, 2);

    if (stringified && stringified.length > 0) {
      return (
        <MarkdownEstimate
          markdownContent={`\`\`\`json\n${stringified}\n\`\`\``}
          projectDetails={projectDetails}
        />
      );
    }
  }

  // Nothing found
  return (
    <FallbackEstimate errorDetails="No valid estimation data received from the service." />
  );
}
