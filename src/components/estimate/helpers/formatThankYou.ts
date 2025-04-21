
/**
 * Extracts/normalizes "Thank You" or similar to a standard section.
 * Also handles Notes & Terms formatting to ensure it's not rendered with special styling.
 */
export function formatThankYou(content: string) {
  // Process Thank You section
  let result = content.replace(
    /(?:Thank you for considering us for your|Thank you for choosing|Thank you)([^#]*)(?=\n### |\n## |$)/gi,
    (_, rest) => {
      return `\n### Thank You\n\nThank you${rest}`;
    }
  );
  
  // Process Notes & Terms section - convert to regular paragraphs instead of headings
  result = result.replace(
    /^(#{1,3})\s+(Notes & Terms|NOTES & TERMS|Notes and Terms|NOTES AND TERMS)/gim,
    "Notes & Terms"
  );
  
  return result;
}
