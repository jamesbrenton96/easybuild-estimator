
import { useEstimateSelector } from "./useEstimateSelector";

/**
 * Hook for extracting and rendering the appropriate estimate component (markdown, structured, fallback)
 * based on API/server estimationResults.
 */
export function useProcessEstimationResults(
  estimationResults: any,
  projectDetails?: {
    clientName?: string;
    projectAddress?: string;
    date?: string;
  }
) {
  return useEstimateSelector(estimationResults, projectDetails);
}
