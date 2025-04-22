
/**
 * Formats the Notes & Terms section with a proper heading while keeping content as normal paragraphs.
 * Ensures the heading matches other section headings for consistency.
 */
export function formatNotesAndTerms(content: string) {
  // Match the Notes & Terms section
  return content.replace(
    /((?:^|\n)(?:#{1,3}\s+)?(Notes & Terms|NOTES & TERMS|Notes and Terms|NOTES AND TERMS)[^\n]*\n)((?:.|\n)*?)(?=\n#{1,3}\s|\n*$)/g,
    (match, headingPart, headingTitle, body) => {
      // Parse the body lines
      const lines = body
        .split('\n')
        .map(line => {
          // Remove leading bullets, numbers, dashes, and excess spaces
          return line
            .replace(/^\s*[-*]\s*/, "")         // - item
            .replace(/^\s*\d+[\.\)]\s*/, "")    // 1.  2)
            .replace(/^\s*•\s*/, "")            // • bullet
            .trim();
        })
        .filter(line => line !== "");
      
      const normalBody = lines.length
        ? '\n' + lines.map(line => `${line}`).join('\n\n') + '\n'
        : "";
      
      // Format with ### to match other section headings (consistent with formatSectionHeadings.ts)
      return `\n### Notes & Terms\n${normalBody}`;
    }
  );
}
