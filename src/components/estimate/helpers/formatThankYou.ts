
/**
 * Extracts/normalizes "Thank You" or similar to a standard section.
 */
export function formatThankYou(content: string) {
  return content.replace(
    /(?:Thank you for considering us for your|Thank you for choosing|Thank you)([^#]*)(?=\n### |\n## |$)/gi,
    (_, rest) => {
      return `\n### Thank You\n\nThank you${rest}`;
    }
  );
}
