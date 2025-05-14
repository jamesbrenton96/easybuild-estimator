
import React from "react";
import { createMarkdownDescription } from "./estimateUtils";
import MarkdownEstimate from "../estimate/MarkdownEstimate";
import FallbackEstimate from "./FallbackEstimate";
import { isValidEstimateContent } from "./isValidEstimateContent";

/**
 * A hook that processes estimation results into a displayable format
 */
export function useProcessEstimationResults(
  estimationResults: any, 
  projectDetails?: any,
  showSources: boolean = true
) {
  if (!estimationResults) {
    return null;
  }
  
  // Case 1: The AI returned a fully valid markdown response
  if (isValidEstimateContent(estimationResults.markdownContent)) {
    // Process any markdown content that needs to be modified
    let markdownContent = estimationResults.markdownContent;
    
    // If we should hide sources, process the markdown to remove source column
    if (!showSources && markdownContent) {
      try {
        // Find tables with a Source column (typical in materials tables)
        const regex = /\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|\n\|(-+)\|(-+)\|(-+)\|(-+)\|(-+)\|\n/g;
        const replacementText = "|$1|$2|$3|$4|\n|$6|$7|$8|$9|\n";
        
        markdownContent = markdownContent.replace(regex, replacementText);
        
        // Replace all rows in that table (assumes consistent column count)
        const rowRegex = /\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|\n/g;
        const rowReplacement = "|$1|$2|$3|$4|\n";
        
        markdownContent = markdownContent.replace(rowRegex, rowReplacement);
      } catch (error) {
        console.error("Error processing markdown to hide sources:", error);
      }
    }
    
    return (
      <MarkdownEstimate 
        markdownContent={markdownContent}
        rawResponse={estimationResults.rawResponse}
        projectDetails={projectDetails}
      />
    );
  }
  
  // Case 2: Try to create markdown from structured data
  if (estimationResults.structuredEstimate) {
    try {
      let markdownContent = createMarkdownDescription(estimationResults.structuredEstimate);
      
      // If hiding sources, process the generated markdown
      if (!showSources && markdownContent) {
        try {
          // Find tables with a Source column (typical in materials tables)
          const regex = /\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|\n\|(-+)\|(-+)\|(-+)\|(-+)\|(-+)\|\n/g;
          const replacementText = "|$1|$2|$3|$4|\n|$6|$7|$8|$9|\n";
          
          markdownContent = markdownContent.replace(regex, replacementText);
          
          // Replace all rows in that table (assumes consistent column count)
          const rowRegex = /\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|\n/g;
          const rowReplacement = "|$1|$2|$3|$4|\n";
          
          markdownContent = markdownContent.replace(rowRegex, rowReplacement);
        } catch (error) {
          console.error("Error processing markdown to hide sources:", error);
        }
      }
      
      return (
        <MarkdownEstimate 
          markdownContent={markdownContent} 
          rawResponse={estimationResults.rawResponse}
          projectDetails={projectDetails}
        />
      );
    } catch (error) {
      console.error("Error creating markdown from structured data:", error);
      // Fall through to fallback
    }
  }
  
  // Case 3: Fallback to displaying raw data
  return <FallbackEstimate estimationResults={estimationResults} />;
}
