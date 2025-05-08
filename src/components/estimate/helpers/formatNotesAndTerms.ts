
/**
 * Formats the Notes and Terms section.
 * Ensures numbered titles are properly formatted and displayed in black.
 */
export function formatNotesAndTerms(content: string): string {
  // Make sure numbers are properly formatted as strong/bold
  const formattedContent = content.replace(
    /(\d+)\.\s+(VALIDITY|PAYMENT TERMS|EXCLUSIONS|VARIATIONS|ACCESS CONSIDERATIONS|WEATHER CONDITIONS|WARRANTY|GST|SITE CONDITIONS|MATERIAL AVAILABILITY)([:\s])/g,
    '<strong>$1. $2</strong>$3'
  );
  
  return formattedContent;
}
