/**
 * Formats Notes & Terms section with section headings and bullet points
 * as per Brenton Building's template format.
 */
export function formatNotesAndTerms(content: string) {
  // Match the Notes & Terms section and its content
  return content.replace(
    /((?:^|\n)(?:#{1,3}\s+)?(?:9\.\s+)?(?:Notes & Terms|NOTES & TERMS|Notes and Terms|NOTES AND TERMS)[^\n]*\n)((?:.|\n)*?)(?=\n#{1,3}\s|\n*$)/g,
    (match, headingPart, body) => {
      // Convert the body content into a structured format with headings and bullet points
      
      // First, separate the content into lines
      const lines = body.split('\n').map(line => line.trim()).filter(line => line);
      
      // Group lines by headings and bullet points
      let formattedContent = '';
      let currentHeading = '';
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Remove any existing formatting
        line = line.replace(/^[•\-\d\.\)\s]+/, '');
        line = line.replace(/^\**|\**$/g, '');
        
        // Check if this is a heading (ends with a colon and isn't a bullet point)
        if (line.endsWith(':') && !line.includes(':') && !line.startsWith('-')) {
          currentHeading = line;
          formattedContent += `\n${currentHeading}\n\n`;
        }
        // Check if this could be a section title (keyword followed by colon)
        else if (line.includes(':') && line.indexOf(':') < 30) {
          const parts = line.split(':');
          currentHeading = parts[0].trim() + ':';
          formattedContent += `\n${currentHeading}\n\n`;
          
          // If there's content after the colon, treat it as first bullet point
          if (parts[1].trim()) {
            formattedContent += `• ${parts[1].trim()}\n`;
          }
        }
        // Otherwise, it's a bullet point under current heading
        else {
          formattedContent += `• ${line}\n`;
        }
      }
      
      // Format the heading as "# 9. Notes & Terms" with consistent styling for PDF
      return `\n# 9. Notes & Terms\n${formattedContent}\n`;
    }
  );
}
