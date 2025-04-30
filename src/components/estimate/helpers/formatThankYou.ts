
/**
 * Extracts/normalizes "Thank You" or similar to a standard section.
 */
export function formatThankYou(content: string) {
  // Process Thank You section
  let result = content.replace(
    /(?:Thank you for considering us for your|Thank you for choosing|Thank you)([^#]*)(?=\n### |\n## |$)/gi,
    (_, rest) => {
      return `\n### Thank You\n\nThank you${rest}`;
    }
  );
  
  // Don't process Notes & Terms in this function as it's handled by formatNotesAndTerms
  
  return result;
}
