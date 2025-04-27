
export function formatNotesAndTerms(content: string) {
  return content.replace(
    /((?:^|\n)(?:#{1,3}\s+)?(?:9\.\s+)?(?:Notes & Terms|NOTES & TERMS|Notes and Terms|NOTES AND TERMS)[^\n]*\n)((?:.|\n)*?)(?=\n#{1,3}\s|\n*$)/g,
    (match, headingPart, body) => {
      const lines = body.split('\n')
        .map(line => line.trim())
        .filter(line => line);

      const formattedItems = lines.map(line => {
        // Remove any existing formatting
        const cleanLine = line.replace(/^[•\-\d\.\)\s]+/, '').trim();
        
        // Extract keyword and content
        const colonIndex = cleanLine.indexOf(':');
        if (colonIndex > -1) {
          const keyword = cleanLine.substring(0, colonIndex).trim();
          const content = cleanLine.substring(colonIndex + 1).trim();
          return `- **${keyword}:** ${content}`;
        }
        
        return `- ${cleanLine}`;
      }).join('\n');

      // Return formatted section with one blank line after the list
      return `\n# 9. Notes & Terms\n\n${formattedItems}\n\n`;
    }
  );
}
