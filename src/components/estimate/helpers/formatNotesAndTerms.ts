/**
 * Converts bullet/numbered items in the Notes & Terms section to dash-bullets with bold keywords.
 * Preserves the heading exactly as "# 9. Notes & Terms" and adds consistent spacing.
 */
export function formatNotesAndTerms(content: string) {
  // Match the Notes & Terms section and its content
  return content.replace(
    /((?:^|\n)(?:#{1,3}\s+)?(?:9\.\s+)?(?:Notes & Terms|NOTES & TERMS|Notes and Terms|NOTES AND TERMS)[^\n]*\n)((?:.|\n)*?)(?=\n#{1,3}\s|\n*$)/g,
    (match, headingPart, body) => {
      // Process each line
      const lines = body
        .split('\n')
        .map(line => {
          // Clean up the line
          line = line.trim();
          if (!line) return '';

          // Remove any existing formatting
          line = line.replace(/^[•\-\d\.\)\s]+/, '');
          line = line.replace(/^\**|\**$/g, '');
          
          // Extract keyword and content if there's a colon
          const colonIndex = line.indexOf(':');
          if (colonIndex > -1) {
            const keyword = line.substring(0, colonIndex).trim();
            const content = line.substring(colonIndex + 1).trim();
            return `- **${keyword}:** ${content}`;
          }
          
          // If no colon found, keep the line as is with a dash
          return `- ${line}`;
        })
        .filter(line => line);

      // Always format as "# 9. Notes & Terms" with consistent spacing
      return `\n# 9. Notes & Terms\n\n${lines.join('\n')}\n\n`;
    }
  );
}
