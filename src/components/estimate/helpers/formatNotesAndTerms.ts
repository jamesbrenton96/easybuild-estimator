/**
 * Converts bullet/numbered items in the Notes & Terms section to normal body text paragraphs.
 * Leaves the heading, but ensures all lines below it until next heading are just plain text.
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
          // Preserve the numbered items format but strip any other formatting
          const numberMatch = line.match(/^\s*(\d+)[\.\)]\s*(.*)/);
          if (numberMatch) {
            // Keep the number. format but remove any markdown styling
            return `${numberMatch[1]}. ${numberMatch[2].trim()}`;
          }
          // Remove leading bullets, dashes, and excess spaces
          return line
            .replace(/^\s*[-*]\s*/, "")         // - item
            .replace(/^\s*•\s*/, "")            // • bullet
            .trim();
        })
        .filter(line => line !== "");
      const normalBody = lines.length
        ? '\n' + lines.map(line => `${line}`).join('\n\n') + '\n'
        : "";
      // Always render heading as ## Notes & Terms (will be styled as H1 in the renderer)
      return `\n## Notes & Terms\n${normalBody}`;
    }
  );
}
