
import { useMemo } from "react";

export function useFormattedMarkdown(markdownContent: string) {
  return useMemo(() => {
    // Starting fresh with minimal implementation
    return markdownContent || "";
  }, [markdownContent]);
}
