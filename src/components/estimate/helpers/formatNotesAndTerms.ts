
/**
 * Formats the Notes and Terms section with extra spacing between lines and no numbers.
 */
export function formatNotesAndTerms(content: string): string {
  // Skip processing if content is empty
  if (!content) return content;
  
  // Split the content by lines
  let lines = content.split('\n');
  
  // Process each line
  const processedLines = lines.map(line => {
    // Remove any numbered list formatting (e.g., "1. ", "1) ", "#. ", etc.)
    line = line.replace(/^\s*(\d+[\.\)]\s*|\d+\.\s*|\#\.\s*)/, '');
    
    // Also remove any leading numbers with a period, dash, or parenthesis
    line = line.replace(/^\s*\d+[\.\-\)]+\s*/, '');
    
    // Remove any bullet points if they exist
    line = line.replace(/^\s*[\-\*•]\s*/, '');
    
    // Clean up the line
    return line.trim();
  });
  
  // Join the lines with double line breaks to add spacing
  return processedLines.join('\n\n');
}
